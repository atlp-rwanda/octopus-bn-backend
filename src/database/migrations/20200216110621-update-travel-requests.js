export default {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'travelRequests',
        'manager',
        {
          allowNull: false,
          type: Sequelize.STRING
        },
      ),
    ]);
  },

  down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('travelRequests', 'manager'),
    ]);
  }
};
