import Service from "./Service";
import Models from "../models";
import { InstagramUserType } from "../models/InstagramUser";

const { InstagramUser, sequelize } = Models;

export interface Params {
  user: InstagramUserType;
}

const IS_FOLLOWING_CASE =
  "(CASE " +
  "WHEN `followee`.`instagram_user_id` IS NOT NULL " +
  "THEN TRUE " +
  "ELSE FALSE " +
  "END) AS `is_following`";

const QUERY =
  "SELECT `InstagramUser`.*, " +
  IS_FOLLOWING_CASE +
  " " +
  "FROM `instagram_users` AS `InstagramUser` " +
  "INNER JOIN `followers` AS `followers` ON `InstagramUser`.`id` = `followers`.`follower_id` AND `followers`.`instagram_user_id` = ? " +
  "LEFT JOIN `followers` AS `followee` ON `followee`.`follower_id` = 2 AND `followee`.`instagram_user_id` = `followers`.`follower_id`";

export default class GetFollowersFor extends Service {
  call(params: Params) {
    const { user } = params;

    return sequelize.query(QUERY, {
      model: InstagramUser,
      replacements: [user.id]
    });
  }
}
