
export default {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users',
        'notifyByEmail',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
      ),
    ]);
  },
  down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('Users', 'notifyByEmail'),
    ]);
  }
};
