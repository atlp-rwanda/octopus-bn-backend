import dotenv from 'dotenv';

dotenv.config();
export default (sequelize, DataTypes) => {
  const travelRequests = sequelize.define('travelRequests', {
    requestId: { type: DataTypes.UUID, allowNull: false },
    userEmail: { type: DataTypes.STRING, allowNull: false },
    type: DataTypes.ENUM('one way', 'return'),
    passportNumber: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    from: { type: DataTypes.STRING, allowNull: false },
    to: { type: DataTypes.STRING, allowNull: false },
    accommodation: { type: DataTypes.STRING, allowNull: false },
    departureDate: { type: DataTypes.STRING, allowNull: false },
    returnDate: { type: DataTypes.STRING },
    reason: { type: DataTypes.STRING, allowNull: false },
    status: DataTypes.ENUM('pending', 'approved', 'rejected')
  }, {});
  travelRequests.associate = () => {
    // associations can be defined here
  };
  return travelRequests;
};
