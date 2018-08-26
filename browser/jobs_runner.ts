import Queue from "bee-queue";
import jobs from "./jobs";

const main = new Queue("main");
main.on("error", err => {
  console.log(`A queue error happened: ${err.message}`);
});
main.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error ${err.message}`);
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

  log(job, "Processing");
  console.log(job.data);
  await jobs[jobClassName].run(params);
  log(job, "Finished");

  return done(null);
});

function log(job, message) {
  console.log(`[#${job.data.jobClassName}][#${job.id}]: ${message}`);
}
