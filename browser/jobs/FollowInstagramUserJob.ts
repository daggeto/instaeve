import Job from "./Job";

export interface Params {
  id: number;
}

export default class FollowInstagramUserJob extends Job {
  async call(params: Params) {
    this.logProgress(params);
  }
}
