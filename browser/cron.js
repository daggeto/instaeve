import cron from 'node-cron';
import LikeAndFollowTopJob from './jobs/LikeAndFollowTopJob'
import {random} from './utils';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const loginAs = process.env.LOGIN_AS;
global.currentUser = fetchUserCredentials(loginAs);
global.configs = fetchConfigs(loginAs);

let running = false;
cron.schedule('* * * * *', function () {
  console.log('Scheduler start');
  if (running) {
    console.log("Job already running");
    return;
  }
  running = true;
  LikeAndFollowTopJob.run(global.configs.LikeAndFollowTopJob);
  running = false;
  console.log("Scheduler stop");
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