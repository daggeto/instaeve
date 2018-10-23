import Queue from "bee-queue";
import Jobs from "./jobs";
import Express from "express";
import Http from "http";
import Socket from "socket.io";
import redis from "redis-promisify";
import utils from "./utils";
import dotenv from "dotenv";

dotenv.config();

enum JobEvents {
  Created = "created",
  Finished = "finished",
  Failed = "failed"
}

const app = Express();
const http = new Http.Server(app);
const io = new Socket(http);
const redisClient = redis.createClient();

io.on("connection", function(socket) {
  console.log("Socket connection successful.");
});

http.listen(3001, function() {
  console.log("Listening on *:3001");
});

const main = new Queue("main");
main.on("error", err => {
  console.log(`A queue error happened: ${err.message}`);
});
main.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error ${err.message}`);
  console.log(err);
});

main.on("job progress", (jobId, progress) => {
  redisClient.set(`jobs_runner.job.lastMessage.${jobId}`, progress.message);
  io.emit("job progress", { id: jobId, ...progress });
});

console.log("Listening for the jobs...");
main.process(async function(job, done) {
  if (!job.data || !job.data.jobClassName) {
    return done(
      new Error(
        'No "jobClassName" specified. Please provide job class name parameter when creating job.'
      )
    );
  }

  await loginFromRedis();

  const { jobClassName, ...params } = job.data;

  if (!Jobs.hasOwnProperty(jobClassName)) {
    return done(new Error(`Can't find job with name ${jobClassName}`));
  }

  job.reportProgress({ message: "Job started", event: JobEvents.Created });

  await Jobs[jobClassName].run({ job, ...params }).catch(error => {
    job.reportProgress({
      message: "Job failed: " + error.message,
      event: JobEvents.Failed
    });
    throw error;
  });
  job.reportProgress({ message: "Job finished", event: JobEvents.Finished });

  return done(null);
});

async function loginFromRedis() {
  const username = await redisClient.getAsync("currentUser");

  global.currentUser = utils.fetchUserCredentials(username);
  global.configs = utils.fetchConfigs(currentUser.username);
}
