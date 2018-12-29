import Service from "./Service";
import Models from "../models";
import { InstagramUserType } from "../models/InstagramUser";
const { InstagramUser } = Models;

export interface Params {
  followerData: InstagramUserType;
}

export default class UpdateOrCreateInstagramUser extends Service {
  async call({ followerData }: Params) {
    const {
      id,
      username,
      full_name,
      profile_pic_url,
      is_private,
      is_verified
    } = followerData;

    const followerInstagramUser = await InstagramUser.find({
      where: {
        instagram_id: id
      }
    });

    if (followerInstagramUser) {
      return await followerInstagramUser.update({
        username,
        full_name,
        profile_pic_url,
        is_private,
        is_verified
      });
    }

    return await InstagramUser.create({
      instagram_id: id,
      username,
      full_name,
      profile_pic_url,
      is_private,
      is_verified
    });
  }
}
