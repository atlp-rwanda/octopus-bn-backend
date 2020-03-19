export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AcommodationLikesAndUnlikes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      imageUrl: {
        type: Sequelize.STRING
      },
      accommodationId: {
        type: Sequelize.STRING
      },
      Like: {
        type: Sequelize.DataTypes.ENUM('liked', 'unliked',),
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