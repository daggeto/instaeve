import Service from "./Service";
import Models from "../models";
import {InstagramUserType} from "../models/InstagramUser";

const {InstagramUser, sequelize} = Models;

export interface Params {
  user: InstagramUserType;
  limit: number;
}

const QUERY =
  "SELECT `InstagramUsers`.* " +
  "FROM `followers` AS `Following` " +
  "INNER JOIN `instagram_users` as `InstagramUsers` on `InstagramUsers`.`id` = `Following`.`instagram_user_id` " +
  "LEFT JOIN `followers` as `Followers` on `InstagramUsers`.`id` = `Followers`.`follower_id` and `Followers`.`instagram_user_id` = ? " +
  "LEFT JOIN favorites on favorites.favorite_id = `Following`.`instagram_user_id` and favorites.instagram_user_id = ? " +
  "WHERE `Following`.`follower_id` = ? AND `Followers`.`follower_id` is null and favorites.id is null";

export default class GetUnfollowersFor extends Service {
  call(params: Params) {
    const {user, limit} = params;

    let finalQuery = QUERY;
    
    if (limit) {
      finalQuery = QUERY + ` limit ${limit}`;
    }

    return sequelize.query(finalQuery, {
      model: InstagramUser,
      replacements: [user.id, user.id, user.id]
    });
  }
}
