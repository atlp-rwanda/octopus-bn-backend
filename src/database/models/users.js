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
    isVerified: DataTypes.BOOLEAN,
    gender: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    preferedLang: DataTypes.STRING,
    preferedCurrency: DataTypes.STRING,
    residence: DataTypes.STRING,
    department: DataTypes.STRING,
    managerEmail: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    bio: DataTypes.STRING,
    passportNumber: DataTypes.STRING,
    role: {
      allowNull: false,
      type: DataTypes.ENUM,
      defaultValue: 'requester',
      values: [
        'super_administrator',
        'travel_administrator',
        'travel_team_member',
        'manager',
        'requester'
      ],
    },
  }, {});
  Users.associate = () => {
    // associations can be defined here
  };
  return Users;
};
