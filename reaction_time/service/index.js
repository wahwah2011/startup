const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const express = require("express");
const uuid = require("uuid");
const app = express();

const authCookieName = "token";

// The scores and users are saved in memory and disappear whenever the service is restarted.
let users = [];
let scores = [1, 2, 3];

const port = process.argv.length > 2 ? process.argv[2] : 3000;

/*Add this code to service/index.js to cause Express static middleware to 
serve files from the public directory once your code has been deployed to 
your AWS server.*/
app.use(express.static("public"));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.get("/scores", (_req, res) => {
  res.send(scores);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
