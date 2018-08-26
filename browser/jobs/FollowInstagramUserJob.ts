import Job from "./Job";
import Queue from "bee-queue";

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
      }, 1000);
    });
  }
}

// export {
//   run: params => {
//     const instance = new FollowInstagramUserJob();
//     return instance.call(params);
//   },
//   scheduleWith: (instagramUserId: number) => {
//     const main = new Queue("main");
//     const job = main.createJob({
//       jobClassName: "FollowInstagramUserJob",
//       id: instagramUserId
//     });
//     job
//       .timeout(3000)
//       .retries(2)
//       .save()
//       .then(job => {
//         console.log(`#{FollowInstagramUserJob}: created`);
//       });
//   }
// };
