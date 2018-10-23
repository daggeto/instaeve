export interface BlockedUserType {
  id: number;
  instagram_user_id: number;
  blocked_user_id: number;
}

export default (sequelize, DataTypes) => {
  var BlockedUser = sequelize.define(
    "BlockedUser",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      instagram_user_id: DataTypes.INTEGER,
      blocker_user_id: DataTypes.INTEGER
    },
    { table: "blocked_users", underscored: true }
  );
  BlockedUser.associate = function(models) {
    BlockedUser.belongsTo(models.InstagramUser);
  };
  return BlockedUser;
};
