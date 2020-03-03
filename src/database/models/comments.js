
module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    userID: DataTypes.STRING,
    requestId: DataTypes.STRING,
    comment: DataTypes.TEXT
  }, {});
  Comments.associate = (models) => {
    // associations can be defined here
    Comments.belongsTo(models.travelRequests, {
      foreignKey: 'requestId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Comments.belongsTo(models.Users, {
      foreignKey: 'userID',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return Comments;
};
