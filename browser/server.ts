import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const loginAs = "daggetoioioi";
global.currentUser = fetchUserCredentials(loginAs);
global.configs = fetchConfigs(loginAs);

const app = express();

const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // allow requests from any other server
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE"); // allow these verbs
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Cache-Control"
  );

  next();
};

app.use(allowCrossDomain);

routes(app, {});
app.listen(port, () => {
  console.log("We are live on " + port);
});

function fetchUserCredentials(username) {
  const users = process.env.USERS;
  const user = users
    .split(";")
    .map(user => user.split(":"))
    .find(user => user[0] === username);

  return { username: user[0], password: user[1] };
}

function fetchConfigs(username) {
  const configFileName = `./configs/${username}_config.json`;

  if (!fs.existsSync(configFileName)) {
    throw `Config file "${configFileName}" doesn't exist.`;
    return;
  }

  const configContents = fs.readFileSync(configFileName);
  return JSON.parse(configContents);
}
