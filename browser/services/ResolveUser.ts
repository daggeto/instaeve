import Service from "./Service";
import Models from "../models";
import { InstagramUserType } from "../models/InstagramUser";

const { InstagramUser } = Models;

export interface Params {
  user: InstagramUserType | string | number;
}
//TODO rename to FindUser
export default class ResolveUser extends Service {
  async call(params: Params) {
    const { user } = params;

    if (typeof user === "string") {
      const result = await InstagramUser.find({ where: { username: user } });

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
