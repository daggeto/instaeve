import Service from "./Service";
import Models from "../models";
import {InstagramUserType} from "../models/InstagramUser";

const {InstagramUser, sequelize} = Models;

export interface Params {
  user: InstagramUserType;
  favoriteFollowee: Number[];
}

const QUERY =
  "SELECT `InstagramUsers`.* " +
  "FROM `followers` AS `Following` " +
  "INNER JOIN `instagram_users` as `InstagramUsers` on `InstagramUsers`.`id` = `Following`.`instagram_user_id` " +
  "LEFT JOIN `followers` as `Followers` on`InstagramUsers`.`id` = `Followers`.`follower_id` and `Followers`.`instagram_user_id` = ? " +
  "WHERE `Following`.`follower_id` = ? AND `Followers`.`follower_id` is null AND `InstagramUsers`.`id` not in (?)";

export default class GetUnfollowersFor extends Service {
  call(params: Params) {
    const {user, favoriteFollowee} = params;
    return sequelize.query(QUERY, {
      model: InstagramUser,
      replacements: [user.id, user.id, favoriteFollowee]
    });
  }
}
