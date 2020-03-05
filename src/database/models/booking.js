
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    userId: DataTypes.STRING,
    accommodationId: DataTypes.STRING,
    roomId: DataTypes.STRING,
    requestId: DataTypes.STRING,
    checkIn: DataTypes.DATE,
    checkOut: DataTypes.DATE,
    isPaid: DataTypes.BOOLEAN,
  }, {});
  Booking.associate = (models) => {
    // associations can be defined here
    Booking.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Booking.belongsTo(models.Accommodations, {
      foreignKey: 'accommodationId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Booking.belongsTo(models.Rooms, {
      foreignKey: 'roomId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Booking.belongsTo(models.travelRequests, {
      foreignKey: 'tripId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Booking;
};
