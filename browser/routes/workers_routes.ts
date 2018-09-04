import Queue from "bee-queue";
import redis from "redis-promisify";
import Jobs from "../jobs";

export default function(app, db) {
  const redisClient = redis.createClient();
  const mainQueue = new Queue("main");
  app.post("/workers/run", async (req, res) => {
    const { jobClassName, hashtag } = req.body;

    if (!jobClassName || !Jobs.hasOwnProperty(jobClassName)) {
      res
        .status(400)
        .json({ errors: [`Can't find job with name ${jobClassName}`] });
    }

    let params =
      jobClassName == "LikeAndFollowTopJob"
        ? {
            currentUser: global.currentUser,
            ...global.configs.LikeAndFollowTopJob,
            hashtag
          }
        : req.body;

    Jobs[jobClassName].schedule({ params });

    res.status(200).json({ data: {} });
  });
  app.get("/", async (req, res) => {
    // FollowInstagramUserJob.schedule(1);
    // FollowInstagramUserJob.schedule(2);
    // FollowInstagramUserJob.schedule(3);

    const keys = await redisClient.keysAsync("jobs_runner.job.lastMessage.*");

    const lastMessages = await redisClient
      .multi(keys.map(key => ["get", key]))
      .execAsync()
      .then(res => res);

    const jobsLastMessages = keys.reduce((carry, key) => {
      const jobId = getJobId(key);
      carry[jobId] = lastMessages[keys.indexOf(key)];
      return carry;
    }, {});

    const activeJobs = await getJobsByStatus(
      mainQueue,
      "active",
      { start: 0, end: 25 },
      jobsLastMessages
    );
    console.log(activeJobs);
    const waitingJobs = await getJobsByStatus(
      mainQueue,
      "waiting",
      { start: 0, end: 25 },
      jobsLastMessages
    );
    const delayedJobs = await getJobsByStatus(
      mainQueue,
      "delayed",
      { start: 0, end: 25 },
      jobsLastMessages
    );
    const succeededJobs = await getJobsByStatus(
      mainQueue,
      "succeeded",
      { size: 1000 },
      jobsLastMessages
    );

    const failedJobs = await getJobsByStatus(
      mainQueue,
      "failed",
      { size: 1000 },
      jobsLastMessages
    );

    res.status(200).json({
      data: [
        ...activeJobs,
        ...waitingJobs,
        ...delayedJobs,
        ...succeededJobs,
        ...failedJobs
      ]
    });
  });
}

function getJobsByStatus(queue, status, jobsLastMessages, params) {
  return queue.getJobs(status, params).then(jobs => {
    return jobs.map(job => {
      const { id, data } = job;

      return {
        id,
        params: data,
        status: status,
        name: data.jobClassName,
        lastMessage: jobsLastMessages[id]
      };
    });
  });
}

function getJobId(key) {
  const keySegments = key.split(".");
  return keySegments[keySegments.length - 1];
}