export default {
    up(queryInterface, Sequelize) {
      return Promise.all([
        queryInterface.addColumn(
          'Accommodations',
          'average_ratings',
          {
            type: Sequelize.NUMERIC(3, 2),
            defaultValue: 0.00,
            allowNull: false
          },
        ),
        queryInterface.addColumn(
          'Accommodations',
          'ratings',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
          },
        )
      ]);
    },
  
    down(queryInterface) {
      return Promise.all([
        queryInterface.removeColumn('Accommodations', 'average_ratings'),
        queryInterface.removeColumn('Accommodations', 'ratings')
      ]);
    }
  };
  