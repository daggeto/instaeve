import Queue from "bee-queue";

export default class Job {
  protected job: { reportProgress: Function };

  constructor(job) {
    this.job = job;
  }

  logProgress(message) {
    this.job.reportProgress({ message });
  }

  static run({ job, ...params }) {
    const instance = new this(job);
    return instance.call(params);
  }

  static schedule(params) {
    const main = new Queue("main");
    const job = main.createJob({ jobClassName: this.name, ...params });
    job
      .retries(2)
      .save()
      .then(job => {
        console.log("Then job id: " + job.id);
      });

    return job;
  }

  call(params, callback?) {
    throw new Error(`Method ".call" must be overridden`);
  }
}
