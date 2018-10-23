import Service from "./Service";
import { InstagramUserType } from "../models/InstagramUser";

export interface Params {
  user: InstagramUserType | number;
  blockedUser: InstagramUserType | number;
}

export default class UnblockUser extends Service {
  async call(params: Params) {
    const user = await this.resolveUser(params.user);
    const blockedUser = await this.resolveUser(params.blockedUser);
    await user.removeBlockedUser(blockedUser);
  }
}
