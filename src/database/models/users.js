import dotenv from 'dotenv';

dotenv.config();
export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    userID: DataTypes.STRING,
    method: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN
  }, {});
  Users.associate = () => {
    // associations can be defined here
  };
  return Users;
};
