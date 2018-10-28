import Controller from "./Controller";
import BlockUser from "../services/BlockUser";
import UnblockUser from "../services/UnblockUser";

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
      currentUserParam: currentUser,
      userToUnfollowParam: blockedUser.id
    });
    return { job };
  }

  async delete(params) {
    const { id } = params;

    if (!id) {
      throw new Error("No id param");
    }

    const currentUser = await this.getCurrentUser();
    await UnblockUser.run({ user: currentUser, blockedUser: id });

    return { success: true };
  }
}
