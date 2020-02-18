
export default {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users',
        'gender',
        {
          allowNull: true,
          type: Sequelize.STRING
        },
      ),
      queryInterface.addColumn(
        'Users',
        'birthDate',
        {
          allowNull: true,
          type: Sequelize.DATE
        },
      ),
      queryInterface.addColumn(
        'Users',
        'preferedLang',
        {
          allowNull: true,
          type: Sequelize.STRING
        },
      ),
      queryInterface.addColumn(
        'Users',
        'preferedCurrency',
        {
          allowNull: true,
          type: Sequelize.STRING
        },
      ),
      queryInterface.addColumn(
        'Users',
        'residence',
        {
          allowNull: true,
          type: Sequelize.STRING
        },
      ),
      queryInterface.addColumn(
        'Users',
        'department',
        {
          allowNull: true,
          type: Sequelize.STRING
        },
      ),
      queryInterface.addColumn(
        'Users',
        'managerEmail',
        {
          allowNull: true,
          type: Sequelize.STRING
        },
      ),
      queryInterface.addColumn(
        'Users',
        'imageUrl',
        {
          allowNull: true,
          type: Sequelize.STRING
        },
      ),
      queryInterface.addColumn(
        'Users',
        'bio',
        {
          allowNull: true,
          type: Sequelize.STRING
        },
      ),
      queryInterface.addColumn(
        'Users',
        'passportNumber',
        {
          allowNull: true,
          type: Sequelize.STRING
        },
      )
    ]);
  },

  down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('Users', 'gender'),
      queryInterface.removeColumn('Users', 'birthDate'),
      queryInterface.removeColumn('Users', 'preferedLang'),
      queryInterface.removeColumn('Users', 'preferedCurrency'),
      queryInterface.removeColumn('Users', 'residence'),
      queryInterface.removeColumn('Users', 'department'),
      queryInterface.removeColumn('Users', 'managerEmail'),
      queryInterface.removeColumn('Users', 'imageUrl'),
      queryInterface.removeColumn('Users', 'bio'),
      queryInterface.removeColumn('Users', 'passportNumber')
    ]);
  }
};
