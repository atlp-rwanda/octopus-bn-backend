export default(sequelize, DataTypes) => {
  const AcommodationLikesAndUnlikes = sequelize.define('AcommodationLikesAndUnlikes', {
    userId: DataTypes.STRING,
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    accommodationId: DataTypes.STRING,
    Like: DataTypes.ENUM('liked', 'unliked')
  }, {});
  AcommodationLikesAndUnlikes.associate = (models) => {
    // associations can be defined here
  };
  return AcommodationLikesAndUnlikes;
};