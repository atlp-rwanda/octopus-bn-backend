
export default {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Notifications',
        'userID',
        {
          allowNull: true,
          type: Sequelize.STRING
        },
      ),
    ])
  },

  down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('Notifications', 'userID'),
    ]);
  }

};
