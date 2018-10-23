import Controller from "./Controller";
import Models from "../models";
import BlockUser from "../services/BlockUser";
import UnblockUser from "../services/UnblockUser";
const { InstagramUser } = Models;

export default class InstagramUsersController extends Controller {
  async index(params) {
    const currentUser = await this.getCurrentUser();
    return currentUser.getBlockedUsers().then(result => {
      return result.map(blockedUser => {
        return { id: blockedUser.id, username: blockedUser.username };
      });
    });
  }

  async block(params) {
    const { username } = params;

    if (!username) {
      throw new Error("No username param");
    }

    const currentUser = await this.getCurrentUser();
    await BlockUser.run({ user: currentUser, blockedUser: username });
    return { go: "yeee" };
  }

  async unblock(params) {
    const { id } = params;

    if (!id) {
      throw new Error("No id param");
    }

    const currentUser = await this.getCurrentUser();
    await UnblockUser.run({ user: currentUser, blockedUser: id });
    return { go: "yeee" };
  }
}
