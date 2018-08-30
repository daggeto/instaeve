import Queue from "bee-queue";
import jobs from "./jobs";
import Express from "express";
import Http from "http";
import Socket from "socket.io";

const app = Express();
const http = new Http.Server(app);
const io = new Socket(http);

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
});

main.on("job progress", (jobId, progress) => {
  console.log(`Job ${jobId} reported progress: ${progress}%`);
  io.emit("job progress", progress);
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

  const { jobClassName, ...params } = job.data;

  if (!jobs.hasOwnProperty(jobClassName)) {
    return done(new Error(`Can't find job with name ${jobClassName}`));
  }

  job.reportProgress({ status: "started" });
  await jobs[jobClassName].run(params);
  job.reportProgress({ status: "finished" });

  return done(null);
});
