import Service from "./Service";
import Models from "../models";
import { InstagramUserType } from "../models/InstagramUser";
const { InstagramUser } = Models;

export interface Params {
  currentUser: InstagramUserType;
  userToFollow: InstagramUserType;
}

export default class Follow extends Service {
  async call(params: Params) {
    const { currentUser, userToFollow } = params;
    await currentUser.addFollowing(userToFollow);
  }
}
