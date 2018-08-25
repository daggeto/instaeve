"use strict";
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      cookies: DataTypes.TEXT,
      instagram_user_id: DataTypes.INTEGER
    },
    { table: "users", underscored: true }
  );
  User.associate = function(models) {
    User.belongsTo(models.InstagramUser);
  };
  return User;
};
