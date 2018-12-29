SELECT `InstagramUsers`.username , `InstagramUsers`.`id` FROM `followers` AS `Following` INNER JOIN `instagram_users` as `InstagramUsers` on `InstagramUsers`.`id` = `Following`.`instagram_user_id` LEFT JOIN `followers` as `Followers` on`InstagramUsers`.`id` = `Followers`.`follower_id` and `Followers`.


select username, count(*) from `instagram_users` group by username order by count(*) asc;

select count(*) from `followers` where instagram_user_id = 1;