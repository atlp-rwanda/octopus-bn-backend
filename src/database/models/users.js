import dotenv from 'dotenv';

dotenv.config();
export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    method: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    isUpdated: DataTypes.BOOLEAN,
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
    notifyByEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {});
  Users.associate = (models) => {
    // associations can be defined here
    Users.hasMany(models.travelRequests, {
      foreignKey: 'userID',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Users.hasMany(models.Notification, {
      foreignKey: 'receiver',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Users;
};
