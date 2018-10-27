import HomePageJob from "./HomePageJob";
import Unfollow from "../services/Unfollow";
import ResolveUser from "../services/ResolveUser";
import { InstagramUserType } from "../models/InstagramUser";

export interface Params {
  currentUserParam: InstagramUserType;
  userToUnfollowParam: InstagramUserType;
}

export default class UnfollowInstagramUserJob extends HomePageJob {
  async call(params: Params) {
    const { currentUserParam, userToUnfollowParam } = params;

    const currentUser = await ResolveUser.run({ user: currentUserParam });
    const userToUnfollow = await ResolveUser.run({ user: userToUnfollowParam });

    await this.openHomePage(userToUnfollow.username, async homePage => {
      this.logProgress(`${userToUnfollow.username} page opened. Unfollowing.`);
      await homePage.unfollow();
      this.logProgress(`${userToUnfollow.username} unfollowed`);
    });

    await Unfollow.run({ currentUser, userToUnfollow });
  }
}
