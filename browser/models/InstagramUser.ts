export interface InstagramUserType {
  id: number;
  instagram_id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  is_private: boolean;
  is_verified: boolean;
  is_following: boolean;
  is_blocked: boolean;
  is_favorite: boolean;
  //         followed_by_viewer: false,
  //           requested_by_viewer: false
}

export default (sequelize, DataTypes) => {
  var InstagramUser = sequelize.define("InstagramUser", { id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }, instagram_id: DataTypes.STRING, username: DataTypes.STRING, full_name: DataTypes.STRING, profile_pic_url: DataTypes.STRING, is_private: DataTypes.BOOLEAN, is_verified: DataTypes.BOOLEAN, created_at: DataTypes.DATE, updated_at: DataTypes.DATE, is_following: DataTypes.VIRTUAL, is_blocked: DataTypes.VIRTUAL, is_favorite: DataTypes.VIRTUAL }, { tableName: "instagram_users", underscored: true });
  InstagramUser.associate = function(models) {
    InstagramUser.belongsToMany(InstagramUser, {
      as: "Followers",
      through: "followers",
      foreignKey: "instagram_user_id"
    });

    InstagramUser.belongsToMany(InstagramUser, {
      as: "Followings",
      through: "followers",
      foreignKey: "follower_id"
    });

    InstagramUser.belongsToMany(InstagramUser, {
      as: "BlockedUsers",
      through: "blocked_users",
      foreignKey: "instagram_user_id"
    });

    InstagramUser.belongsToMany(InstagramUser, {
      as: "Favorite",
      through: "favorites",
      foreignKey: "instagram_user_id"
    });

    InstagramUser.hasMany(models.Follower, { as: "FollowersAssoc" });
  };

  return InstagramUser;
};
