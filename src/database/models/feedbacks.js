'use strict';
module.exports = (sequelize, DataTypes) => {
  const Feedbacks = sequelize.define('Feedbacks', {
    accommodationId: DataTypes.STRING,
    feedback: DataTypes.STRING,
    userId: DataTypes.STRING
  }, {});
  Feedbacks.associate = function(models) {
    // associations can be defined here
    Feedbacks.belongsTo(models.Accommodations, {
      foreignKey: 'accommodationId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Feedbacks.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Feedbacks;
};
