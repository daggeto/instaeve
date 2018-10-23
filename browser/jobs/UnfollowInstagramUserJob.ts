import HomePageJob from "./HomePageJob";
import Unfollow from "../services/Unfollow";
import ResolveUser from "../services/ResolveUser";
import { InstagramUserType } from "../models/InstagramUser";

export interface Params {
  currentUserId: InstagramUserType;
  userToUnfollowId: InstagramUserType;
}

export default class UnfollowInstagramUserJob extends HomePageJob {
  async call(params: Params) {
    const { currentUserId, userToUnfollowId } = params;

    const currentUser = await ResolveUser.run({ user: currentUserId });
    const userToUnfollow = await ResolveUser.run({ user: userToUnfollowId });

    await this.openHomePage(userToUnfollow.username, async homePage => {
      this.logProgress(`${userToUnfollow.username} page opened. Unfollowing.`);
      await homePage.unfollow();
      this.logProgress(`${userToUnfollow.username} unfollowed`);
    });

    await Unfollow.run({ currentUser, userToUnfollow });
  }
}
