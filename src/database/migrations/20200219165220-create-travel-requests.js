
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('travelRequests', {
    id: {
      allowNull: false,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    requestId: {
      allowNull: false,
      type: Sequelize.DataTypes.UUID,
    },
    userID: {
      type: Sequelize.STRING,
      allowNull: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Users',
        key: 'userID',
        as: 'userID',
      }
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
      type: Sequelize.STRING,
    },
    accommodation: {
      type: Sequelize.STRING
    },
    from: {
      type: Sequelize.STRING
    },
    to: {
      type: Sequelize.STRING
    },
    departureDate: {
      type: Sequelize.STRING
    },
    returnDate: {
      type: Sequelize.STRING
    },
    reason: {
      type: Sequelize.STRING
    },
    status: {
      allowNull: false,
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
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
  down: (queryInterface) => queryInterface.dropTable('traveRequests')
};
