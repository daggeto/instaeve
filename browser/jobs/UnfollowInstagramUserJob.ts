import Queue from "bee-queue";
import Job from "./Job";
interface Params {}

export default class UnfollowInstagramUserJob extends Job {
  async call(params: Params) {
    return new Promise(function(resolve, reject) {
      setTimeout(() => {
        console.log(`Running UnfollowInstagramUserJob`);
        console.log("Params: ");
        console.log(params);
        resolve();
      }, 1000);
    });
  }
}
