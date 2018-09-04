import dotenv from "dotenv";
import fs from "fs";
import Jobs from "./jobs";

dotenv.config();
const loginAs = process.env.LOGIN_AS;

type Params = {
  job: string | null;
};

const args: Params = process.argv.slice(2).reduce(
  (carry: Params, argument): Params => {
    const [key, value] = argument.split("=");
    carry[key] = value;

    return carry;
  },
  { job: null }
);

const { job, ...params } = args;

if (!job || !Jobs.hasOwnProperty(job)) {
  throw new Error("Job not exists");
}

global.currentUser = fetchUserCredentials(loginAs);
global.configs = fetchConfigs(loginAs);

const jobMock = {
  reportProgress: message => {
    console.log("[PROGRESS] " + message.message);
  }
};

Jobs[job].run({ job: jobMock, ...params });

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
