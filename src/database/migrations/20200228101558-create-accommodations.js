export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Accommodations', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    createdBy: {
      allowNull: false,
      type: Sequelize.STRING
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING
    },
    country: {
      allowNull: false,
      type: Sequelize.STRING
    },
    city: {
      allowNull: false,
      type: Sequelize.STRING
    },
    imageUrl: {
      allowNull: false,
      type: Sequelize.STRING
    },
    amenities: {
      allowNull: false,
      type: Sequelize.ARRAY(Sequelize.JSON),
      defaultValue: []
    },
    around: {
      allowNull: false,
      type: Sequelize.ARRAY(Sequelize.JSON),
      defaultValue: []
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('Accommodations')
};
