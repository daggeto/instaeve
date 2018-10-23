import fs from "fs";

module.exports.asyncForEach = async function(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

module.exports.randomSleep = async function(from, to) {
  return new Promise(resolve =>
    setTimeout(resolve, from + Math.floor(Math.random() * (to - from)))
  );
};

module.exports.sleep = async function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.random = function(from, to) {
  return from + Math.floor(Math.random() * (to - from));
};

module.exports.fetchUserCredentials = function(username) {
  const users = process.env.USERS;
  const user = users
    .split(";")
    .map(user => user.split(":"))
    .find(user => user[0] === username);

  return { username: user[0], password: user[1] };
};

module.exports.fetchConfigs = function(username) {
  const configFileName = `./configs/${username}_config.json`;

  if (!fs.existsSync(configFileName)) {
    throw `Config file "${configFileName}" doesn't exist.`;
    return;
  }

  const configContents = fs.readFileSync(configFileName);
  return JSON.parse(configContents);
};
