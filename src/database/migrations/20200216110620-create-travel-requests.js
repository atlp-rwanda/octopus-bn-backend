/* eslint-disable no-unused-vars */
export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('travelRequests', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true
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
    type: {
      allowNull: false,
      type: Sequelize.ENUM('one way', 'return', 'multi city'),
      defaultValue: 'one way',
    },
    passportNumber: {
      allowNull: false,
      type: Sequelize.STRING
    },
    gender: {
      allowNull: false,
      type: Sequelize.ENUM('male', 'female', 'other'),
    },
    accommodation: {
      allowNull: true,
      type: Sequelize.STRING
    },
    from: {
      allowNull: false,
      type: Sequelize.STRING
    },
    to: {
      allowNull: false,
      type: Sequelize.STRING
    },
    departureDate: {
      allowNull: false,
      type: Sequelize.STRING
    },
    returnDate: {
      type: Sequelize.STRING
    },
    reason: {
      allowNull: true,
      type: Sequelize.STRING
    },
    status: {
      allowNull: false,
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    stops: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('travelRequests')
};
