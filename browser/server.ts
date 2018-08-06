const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const SyncFollowers = require("./services/SyncFollowers");
const app = express();

import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

global.currentUser = fetchUserCredentials(process.env.LOGIN_AS);
global.util = require("util");
global.asyncForEach = async function(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}



// const port = 8000;
// app.use(bodyParser.urlencoded({ extended: true }));
// require('./routes')(app, {});
// app.listen(port, () => {
//   console.log('We are live on ' + port);
// });
try {
  SyncFollowers.run({ username: global.currentUser.username });
} catch (e) {
  console.log(e);
}

function fetchUserCredentials(username) {
  const users = process.env.USERS;
  
  const user = users
    .split(";")
    .map(user => user.split(":"))
    .find(user => user[0] === username);

  return { username: user[0], password: user[1] };
}