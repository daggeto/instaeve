import Models from "../models";
const { InstagramUser } = Models;

export default class Service {
  static run(params) {
    const instance = new this();
    return instance.call(params);
  }

  call(params) {
    throw new Error(`Method ".call" must be overridden`);
  }

  async resolveUser(user: InstagramUserType | number) {
    if (typeof user === "string") {
      const result = await InstagramUser.find({
        where: { username: user }
      });

      if (!result) {
        throw new Error(`User "${user}" doesn't exist`);
      }

      return result;
    }
    if (typeof user === "number") {
      return await InstagramUser.findById(user);
    }

    return user;
  }
}
