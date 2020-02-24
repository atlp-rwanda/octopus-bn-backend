
export default {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users',
        'isUpdated',
        {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
      ),
    ]);
  },

  down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('Users', 'isUpdated'),
    ]);
  }
};
