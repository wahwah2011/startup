const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const express = require("express");
const uuid = require("uuid");
const app = express();

const { MongoClient } = require("mongodb");
const config = require("./dbConfig.json");

const url = `mongodb://${config.userName}:${config.password}@${config.hostname}/?ssl=true&replicaSet=atlas-zoukv7-shard-0&authSource=admin&appName=cs260`;
const client = new MongoClient(url);
const db = client.db("reaction_time");
const userCollection = db.collection("user");
const scoreCollection = db.collection("score");
const progressCollection = db.collection("progress");

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log("Connected to database");
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

const authCookieName = "token";

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// --- Auth endpoints ---

apiRouter.post("/auth/create", async (req, res) => {
  if (await findUser("username", req.body.username)) {
    res.status(409).send({ msg: "Existing user" });
  } else {
    const user = await createUser(req.body.username, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ username: user.username });
  }
});

apiRouter.post("/auth/login", async (req, res) => {
  const user = await findUser("username", req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = uuid.v4();
      await userCollection.updateOne({ username: user.username }, { $set: { token } });
      setAuthCookie(res, token);
      res.send({ username: user.username });
      return;
    }
  }
  res.status(401).send({ msg: "Unauthorized" });
});

apiRouter.delete("/auth/logout", async (req, res) => {
  const user = await findUser("token", req.cookies[authCookieName]);
  if (user) {
    await userCollection.updateOne({ username: user.username }, { $unset: { token: 1 } });
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// --- Auth middleware ---

const verifyAuth = async (req, res, next) => {
  const user = await findUser("token", req.cookies[authCookieName]);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
};

// --- Score endpoints ---

apiRouter.get("/scores", verifyAuth, async (_req, res) => {
  const scores = await getHighScores();
  res.send(scores);
});

apiRouter.post("/score", verifyAuth, async (req, res) => {
  await scoreCollection.insertOne(req.body);
  const scores = await getHighScores();
  res.send(scores);
});

// --- Progress endpoints ---

apiRouter.get("/progress", verifyAuth, async (req, res) => {
  const data = await progressCollection.findOne({ username: req.user.username });
  res.send(data || null);
});

apiRouter.post("/progress", verifyAuth, async (req, res) => {
  const update = { ...req.body, username: req.user.username };
  await progressCollection.updateOne(
    { username: req.user.username },
    { $set: update },
    { upsert: true }
  );
  res.send(update);
});

// --- Error handler ---

app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// --- Helper functions ---

async function getHighScores() {
  const cursor = scoreCollection.find({}, { sort: { score: -1 }, limit: 10 });
  return cursor.toArray();
}

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  return userCollection.findOne({ [field]: value });
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });
}
