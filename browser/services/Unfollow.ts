import Service from "./Service";
import Models from "../models";
import { InstagramUserType } from "../models/InstagramUser";
const { InstagramUser } = Models;

export interface Params {
  currentUser: InstagramUserType;
  userToUnfollow: InstagramUserType;
}

export default class Unfollow extends Service {
  async call(params: Params) {
    const { currentUser, userToUnfollow } = params;
    await currentUser.removeFollowing(userToUnfollow);
  }
}
