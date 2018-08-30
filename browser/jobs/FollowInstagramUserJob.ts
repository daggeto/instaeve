import Job from "./Job";

export interface Params {
  id: number;
}

export default class FollowInstagramUserJob extends Job {
  async call(params: Params) {
    return new Promise(function(resolve, reject) {
      setTimeout(() => {
        console.log(`Running FollowInstagramUserJob`);
        console.log("Params: ");
        console.log(params);
        resolve();
      }, 2000);
    });
  }
}
