
module.exports = (sequelize, DataTypes) => {
  const Chats = sequelize.define('Chats', {
    message: DataTypes.STRING,
    userId: DataTypes.STRING,

  }, {});
  Chats.associate = function (models) {
    // associations can be defined here
    Chats.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Chats;
};
