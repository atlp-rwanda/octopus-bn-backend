/* eslint-disable no-unused-vars */
module.exports = (sequelize, DataTypes) => {
  const Rooms = sequelize.define('Rooms', {
    roomNumber: DataTypes.STRING,
    cost: DataTypes.NUMBER,
    accommodationsID: DataTypes.STRING,
    type: DataTypes.ENUM('Single', 'Double', 'Triple', 'Quad', 'Queen', 'King', 'Twin', 'Double-double', 'Studio', 'Master-Suite', 'Mini-Suite'),
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.STRING,
    currency: DataTypes.STRING
  }, {});
  Rooms.associate = (models) => {
    // associations can be defined here
    Rooms.belongsTo(models.Accommodations, {
      foreignKey: 'accommodationsID',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Rooms;
};
