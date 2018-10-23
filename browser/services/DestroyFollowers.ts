import Service from "./Service";
import Models from "../models";

const {
  Sequelize: { Op },
  Follower
} = Models;

export interface Params {
  instagramUserIds: number[];
  currentInstagramUser: any;
}

export default class DestroyFollowers extends Service {
  async call(params: Params) {
    const { currentInstagramUser, instagramUserIds } = params;

    const fassync = await Follower.destroy({
      where: {
        instagram_user_id: currentInstagramUser.id,
        follower_id: {
          [Op.in]: instagramUserIds
        }
      }
    });
  }
}
