import Queue from "bee-queue";
import FollowInstagramUserJob from "../jobs/FollowInstagramUserJob";

export default function(app, db) {
  app.get("/", async (req, res) => {
    FollowInstagramUserJob.schedule(1);
    FollowInstagramUserJob.schedule(2);
    FollowInstagramUserJob.schedule(3);

    const mainQueue = new Queue("main");

    const activeJobs = await mainQueue
      .getJobs("active", { start: 0, end: 25 })
      .then(mapJobs);

    const waitingJobs = await mainQueue
      .getJobs("waiting", { start: 0, end: 25 })
      .then(mapJobs);

    const delayedJobs = await mainQueue
      .getJobs("delayed", { start: 0, end: 25 })
      .then(mapJobs);

    res.json(200, { data: [...activeJobs, ...waitingJobs, ...delayedJobs] });
  });

  function mapJobs(jobs) {
    return jobs.map(job => {
      const { id, data, status } = job;

      return { id, data, status };
    });
  }
}
