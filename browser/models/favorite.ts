export interface FavoriteType {
  id: number;
  instagram_user_id: number;
  favorite_id: number;
}

export default (sequelize, DataTypes) => {
  var Favorite = sequelize.define(
    'Favorite', 
    {
      id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
      instagram_user_id: DataTypes.INTEGER,
      favorite_id: DataTypes.INTEGER
    }, 
    {table: "favorites", underscored: true}
  );

  Favorite.associate = function(models) {
    Favorite.belongsTo(models.InstagramUser);
  };
  return Favorite;
};