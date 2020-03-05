export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    receiver: {
      type: DataTypes.STRING,
    },
    requestID: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    body: {
      type: DataTypes.STRING,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
    },
  }, {});
  Notification.associate = (models) => {
    Notification.belongsTo(models.Users, {
      foreignKey: 'receiver',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Notification;
};
