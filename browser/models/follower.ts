export default (sequelize, DataTypes) => {
  var Follower = sequelize.define(
    "Follower",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      instagram_user_id: DataTypes.INTEGER,
      follower_id: DataTypes.INTEGER
    },
    { table: "followers", underscored: true }
  );
  Follower.associate = function(models) {
    Follower.belongsTo(models.InstagramUser);
  };
  return Follower;
};
