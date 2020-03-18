export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AcommodationLikesAndUnlikes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING
      },
      accommodationId: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface) =>  queryInterface.dropTable('AcommodationLikesAndUnlikes')
};
