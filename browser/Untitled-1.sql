SELECT`InstagramUser`.`id`, `InstagramUser`.`username`, `followers`.`followere`
FROM `instagram_users` AS `InstagramUser` 
INNER JOIN `followers` AS `followers` ON `InstagramUser`.`id` = `followers`.`follower_id` AND `followers`.`instagram_user_id` = 2;

SELECT`InstagramUser`.`id`, `InstagramUser`.`username`, `followers`.`follower_id`, `followee`.`instagram_user_id`
FROM `instagram_users` AS `InstagramUser` 
INNER JOIN `followers` AS `followers` ON `InstagramUser`.`id` = `followers`.`follower_id` AND `followers`.`instagram_user_id` = 2
LEFT JOIN `followers` AS `followee` ON `followee`.`follower_id` = 2 AND `followee`.`instagram_user_id` = `followers`.`follower_id`;

INSERT INTO followers (instagram_user_id)