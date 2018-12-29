export interface FavoriteType {
  id: number;
  instagram_user_id: number;
  favorite_user_id: number;
}

export default (sequelize, DataTypes) => {
  var Favorite = sequelize.define(
    'Favorite', 
    {
      instagram_user_id: DataTypes.INTEGER,
      favorite_user_id: DataTypes.INTEGER
    }, 
    {table: "favorites", underscored: true}
  );

  Favorite.associate = function(models) {
    Favorite.belongsTo(models.InstagramUser);
  };
  return Favorite;
};