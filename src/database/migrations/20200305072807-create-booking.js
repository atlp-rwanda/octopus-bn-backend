
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      userId: {
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
      accommodationId: {
        type: Sequelize.STRING,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Accommodations',
          key: 'id',
          as: 'id',
        },
      },
      roomId: {
        type: Sequelize.STRING,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Rooms',
          key: 'id',
          as: 'id',
        },
      },
      tripId: {
        type: Sequelize.STRING,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'travelRequests',
          key: 'id',
          as: 'id',
        },
      },
      checkIn: {
        type: Sequelize.DATE,
        allowNull: false
      },
      checkOut: {
        type: Sequelize.DATE,
        allowNull: false
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
        default: false
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
  down: (queryInterface) => queryInterface.dropTable('Bookings')
};
