import Service from "./Service";
import { InstagramUserType } from "../models/InstagramUser";

export interface Params {
  currentUser: InstagramUserType | string | number;
  blockedUser: InstagramUserType | string | number;
}

export default class BlockUser extends Service {
  async call(params: Params) {
    const user = await this.resolveUser(params.currentUser);
    const blockedUser = await this.resolveUser(params.blockedUser);
    await user.addBlockedUser(blockedUser);
  }
}
