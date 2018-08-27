import Queue from "bee-queue";

export default class Job {
  protected job: Job;

  constructor(job) {
    this.job = job;
  }

  static run({ job, ...params }) {
    const instance = new this(job);
    return instance.call(params);
  }

  static schedule(instagramUserId) {
    const main = new Queue("main");
    const job = main.createJob({
      jobClassName: this.name,
      id: instagramUserId
    });
    job
      .timeout(3000)
      .retries(2)
      .save()
      .then(job => {});
  }

  call(params) {
    throw new Error(`Method ".call" must be overridden`);
  }
}
