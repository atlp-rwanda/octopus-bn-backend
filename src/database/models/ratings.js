'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ratings = sequelize.define('Ratings', {
    rating: DataTypes.INTEGER,
    userId: DataTypes.STRING,
    accommodationId: DataTypes.STRING,
  }, {});
  Ratings.associate = function(models) {
    // associations can be defined here
    Ratings.belongsTo(models.Accommodations, {
      foreignKey: 'accommodationId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Ratings.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Ratings;
};