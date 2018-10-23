import Controller from "./Controller";
import BlockUser from "../services/BlockUser";
import ResolveUser from "../services/ResolveUser";
import UnfollowInstagramUserJob from "../jobs/UnfollowInstagramUserJob";

export default class BlockedUsersController extends Controller {
  async create(params) {
    const { id } = params;

    if (!id) {
      throw new Error("No id param");
    }

    const currentUser = await this.getCurrentUser();
    const blockedUser = await ResolveUser.run({ user: id });
    await BlockUser.run({ currentUser, blockedUser });

    const job = UnfollowInstagramUserJob.schedule({
      username: blockedUser.username
    });
    return { job };
  }

  // async unblock(params) {
  //   const { id } = params;

  //   if (!id) {
  //     throw new Error("No id param");
  //   }

  //   const currentUser = await this.getCurrentUser();
  //   await UnblockUser.run({ user: currentUser, blockedUser: id });
  //   return { go: "yeee" };
  // }
}
