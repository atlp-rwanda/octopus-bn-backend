export default (sequelize, DataTypes) => {
  const AcommodationLikesAndUnlikes = sequelize.define(
    "AcommodationLikesAndUnlikes",
    {
      userId: DataTypes.STRING,
      accommodationId: DataTypes.STRING,
    },
    {}
  );
  AcommodationLikesAndUnlikes.associate = (models) => {
    // associations can be defined here
    AcommodationLikesAndUnlikes.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    AcommodationLikesAndUnlikes.belongsTo(models.Accommodations, {
      foreignKey: "accommodationId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return AcommodationLikesAndUnlikes;
};
