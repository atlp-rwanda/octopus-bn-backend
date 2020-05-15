module.exports = (sequelize, DataTypes) => {
  const Accommodations = sequelize.define('Accommodations', {
    createdBy: DataTypes.STRING,
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    average_ratings: {
      type: DataTypes.NUMERIC(3, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    ratings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    imageUrl: DataTypes.STRING,
    amenities: { type: DataTypes.ARRAY(DataTypes.JSON) },
    around: { type: DataTypes.ARRAY(DataTypes.JSON) },
  }, {});
  Accommodations.associate = (models) => {
    // associations can be defined here
    Accommodations.hasMany(models.Rooms, {
      foreignKey: 'accommodationsID',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Accommodations.hasMany(models.Booking, {
      foreignKey: 'accommodationId',
      onDelete: 'CASCADE',
    });

    Accommodations.hasMany(models.Feedbacks, {
      foreignKey: 'accommodationId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Accommodations.hasMany(models.AcommodationLikesAndUnlikes, {
      foreignKey: 'accommodationId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Accommodations;
};
