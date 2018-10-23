import HomePageJob from "./HomePageJob";
import Follow from "../services/Follow";
import ResolveUser from "../services/ResolveUser";
import { InstagramUserType } from "../models/InstagramUser";

export interface Params {
  currentUserId: InstagramUserType;
  userToFollowId: InstagramUserType;
}

export default class FollowInstagramUserJob extends HomePageJob {
  async call(params: Params) {
    const { currentUserId, userToFollowId } = params;

    const currentUser = await ResolveUser.run({ user: currentUserId });
    const userToFollow = await ResolveUser.run({ user: userToFollowId });

    await this.openHomePage(userToFollow.username, async homePage => {
      this.logProgress(`${userToFollow.username} page opened. Following.`);
      await homePage.follow();
      this.logProgress(`${userToFollow.username} followed`);
    });

    await Follow.run({ currentUser, userToFollow });
  }
}
