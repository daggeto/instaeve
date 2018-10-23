import Models from "../models";

const { InstagramUser } = Models;

export default class Controller {
  async getCurrentUser() {
    const { username } = global.currentUser;

    if (!username) {
      throw new Error("Current user not exists in global context");
    }
    return InstagramUser.find({
      where: { username }
    });
  }
}
