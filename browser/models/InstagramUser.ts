export interface InstagramUserType {
  id: number;
  instagram_id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  is_private: boolean;
  is_verified: boolean;
  //         followed_by_viewer: false,
  //           requested_by_viewer: false
}

export default (sequelize, DataTypes) => {
  var InstagramUser = sequelize.define(
    "InstagramUser",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      instagram_id: DataTypes.STRING,
      username: DataTypes.STRING,
      full_name: DataTypes.STRING,
      profile_pic_url: DataTypes.STRING,
      is_private: DataTypes.BOOLEAN,
      is_verified: DataTypes.BOOLEAN,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
    },
    { tableName: "instagram_users", underscored: true }
  );
  InstagramUser.associate = function(models) {
    // InstagramUser.hasMany(models.Follower);
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

    InstagramUser.hasMany(models.Follower);
  };

  return InstagramUser;
};
