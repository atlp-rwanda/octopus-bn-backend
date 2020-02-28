
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Rooms', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    accommodationsID: {
      allowNull: false,
      type: Sequelize.STRING,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Accommodations',
        key: 'id',
        as: 'id',
      },
    },
    roomNumber: {
      allowNull: false,
      type: Sequelize.STRING
    },
    cost: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    currency: {
      allowNull: false,
      type: Sequelize.STRING
    },
    type: {
      allowNull: false,
      type: Sequelize.ENUM('Single', 'Double', 'Triple', 'Quad', 'Queen', 'King', 'Twin', 'Double-double', 'Studio', 'Master-Suite', 'Mini-Suite'),
      defaultValue: 'Single',
    },
    status: {
      allowNull: false,
      type: Sequelize.BOOLEAN
    },
    createdBy: {
      allowNull: false,
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
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Rooms')
};
