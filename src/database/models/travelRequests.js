import dotenv from 'dotenv';

dotenv.config();
export default (sequelize, DataTypes) => {
  const travelRequests = sequelize.define('travelRequests', {
    requestId: { type: DataTypes.UUID, allowNull: false },
    userID: { type: DataTypes.STRING, allowNull: false },
    type: DataTypes.ENUM('one way', 'return', 'multi city'),
    passportNumber: { type: DataTypes.STRING, allowNull: false },
    gender: DataTypes.ENUM('male', 'female', 'other'),
    from: { type: DataTypes.STRING, allowNull: false },
    to: { type: DataTypes.STRING, allowNull: false },
    accommodation: { type: DataTypes.STRING, allowNull: false },
    departureDate: { type: DataTypes.STRING, allowNull: false },
    returnDate: { type: DataTypes.STRING },
    reason: { type: DataTypes.STRING, allowNull: false },
    status: DataTypes.ENUM('pending', 'approved', 'rejected')
  }, {});
  travelRequests.associate = (models) => {
    // associations can be defined here
    travelRequests.belongsTo(models.Users, {
      foreignKey: 'userID',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return travelRequests;
};
