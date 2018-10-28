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

const IS_BLOCKED_CASE =
  "(CASE " +
  "WHEN `blocked_users`.`instagram_user_id` IS NOT NULL " +
  "THEN TRUE " +
  "ELSE FALSE " +
  "END) AS `is_blocked`";
// InstagramUser -> all followers with user_id as current -> check for every follower if current user are in their followers
// ->
const QUERY =
  "SELECT `InstagramUser`.*, " +
  IS_FOLLOWING_CASE +
  ", " +
  IS_BLOCKED_CASE +
  " " +
  "FROM `instagram_users` AS `InstagramUser` " +
  "INNER JOIN `followers` AS `followers` ON `InstagramUser`.`id` = `followers`.`follower_id` AND `followers`.`instagram_user_id` = ? " +
  "LEFT JOIN `followers` AS `followee` ON `followee`.`follower_id` = ? AND `followee`.`instagram_user_id` = `followers`.`follower_id`" +
  "LEFT JOIN `blocked_users` ON `blocked_users`.`instagram_user_id` = ? and `blocked_users`.`blocked_user_id` = `followers`.`follower_id`";

export default class GetFollowersFor extends Service {
  call(params: Params) {
    const { user } = params;

    return sequelize.query(QUERY, {
      model: InstagramUser,
      replacements: [user.id, user.id, user.id]
    });
  }
}
