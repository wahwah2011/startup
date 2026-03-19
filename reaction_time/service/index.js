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

const authCookieName = "token";

let users = [];
let progress = {};
const botNames = ["Lavoisier", "Curie", "Dalton", "Mendeleev", "Pasteur"];
let scores = [
  { name: "Lavoisier", score: 15 },
  { name: "Curie", score: 11 },
  { name: "Dalton", score: 8 },
  { name: "Mendeleev", score: 5 },
  { name: "Pasteur", score: 3 },
];

setInterval(() => {
  const bot = botNames[Math.floor(Math.random() * botNames.length)];
  const entry = scores.find((s) => s.name === bot);
  if (entry) {
    entry.score += 1;
    scores.sort((a, b) => b.score - a.score);
  }
}, 4000);

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
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      res.send({ username: user.username });
      return;
    }
  }
  res.status(401).send({ msg: "Unauthorized" });
});

apiRouter.delete("/auth/logout", async (req, res) => {
  const user = await findUser("token", req.cookies[authCookieName]);
  if (user) {
    delete user.token;
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

apiRouter.get("/scores", verifyAuth, (_req, res) => {
  res.send(scores);
});

apiRouter.post("/score", verifyAuth, (req, res) => {
  scores = updateScores(req.body);
  res.send(scores);
});

// --- Progress endpoints ---

apiRouter.get("/progress", verifyAuth, (req, res) => {
  const data = progress[req.user.username] || null;
  res.send(data);
});

apiRouter.post("/progress", verifyAuth, (req, res) => {
  progress[req.user.username] = req.body;
  res.send(progress[req.user.username]);
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

function updateScores(newScore) {
  scores = scores.filter((s) => s.name !== newScore.name);

  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.length = 10;
  }

  return scores;
}

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  return users.find((u) => u[field] === value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });
}
