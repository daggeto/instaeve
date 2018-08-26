import Queue from "bee-queue";

export default class Job {
  static run(params) {
    const instance = new this();
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
}
