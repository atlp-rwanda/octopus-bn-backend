
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Comments', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    requestId: {
      type: Sequelize.STRING,
      allowNull: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'travelRequests',
        key: 'id',
        as: 'id',
      }
    },
    userID: {
      type: Sequelize.STRING,
      allowNull: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'id',
      },
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: false,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Comments')
};
