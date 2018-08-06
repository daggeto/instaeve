const express = require('express');
const app = express();

import SyncFollowers from "./services/SyncFollowers";
import dotenv from "dotenv";

dotenv.config();

interface UserCredentials {
  username: string;
  password: string;
}

interface GlobalContext extends NodeJS.Global {
  currentUser: UserCredentials;
  util: any;
  asyncForEach: Function;
}

const globalContext: GlobalContext = global;

globalContext.currentUser = fetchUserCredentials(process.env.LOGIN_AS);
globalContext.util = require("util");
globalContext.asyncForEach = async function(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

// const port = 8000;
// app.use(bodyParser.urlencoded({ extended: true }));
// require('./routes')(app, {});
// app.listen(port, () => {
//   console.log('We are live on ' + port);
// });
// try {
//   SyncFollowers({ username: globalContext.currentUser.username });
// } catch (e) {
//   console.log(e);
// }
function fetchUserCredentials(username) {
  const users = process.env.USERS;
  

  const user = users!
    .split(";")
    .map(user => user.split(":"))
    .find(user => user[0] === username);

  return { username: user[0], password: user[1] };
}