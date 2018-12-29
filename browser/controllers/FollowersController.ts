import Controller from "./Controller";
import GetFollowersFor from "../services/GetFollowersFor";
import ResolveUser from "../services/ResolveUser";
import FollowInstagramUserJob from "../jobs/FollowInstagramUserJob";
import UnfollowInstagramUserJob from "../jobs/UnfollowInstagramUserJob";
import { InstagramUserType } from "../models/InstagramUser";

export default class FollowersController extends Controller {
  async index(params) {
    const currentUser = await this.getCurrentUser();
    const followers: any = await GetFollowersFor.run({
      user: currentUser
    });

    return {
      followers: followers.map(follower => {
        return this.serializeUser(follower);
      }),
      totalCount: followers.length
    };
  }

  async create(params) {
    const { id } = params;
    const userToFollow = await ResolveUser.run({
      user: id
    });

    if (!userToFollow) {
      throw new Error(`Can't find user: ${id}`);
    }

    const currentUser = await this.getCurrentUser();
    await FollowInstagramUserJob.schedule({
      currentUserId: currentUser.id,
      userToFollowId: userToFollow.id
    });

    return {};
  }

  async delete(params) {
    const { id } = params;
    const userToUnfollow = await ResolveUser.run({ user: id });

    if (!userToUnfollow) {
      throw new Error(`Can't find user: ${id}`);
    }

    const currentUser = await this.getCurrentUser();
    await UnfollowInstagramUserJob.schedule({
      currentUserParam: currentUser,
      userToUnfollowParam: userToUnfollow
    });

    return {};
  }

  private serializeUser(user: InstagramUserType) {
    return {
      id: user.id,
      username: user.username,
      imageSrc: user.profile_pic_url,
      isFollowing: user.is_following,
      isBlocked: user.is_blocked,
      isFavorite: user.is_favorite,
    };
  }
}
