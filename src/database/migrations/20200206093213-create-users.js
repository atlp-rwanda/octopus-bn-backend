export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    userID: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    method: {
      type: Sequelize.STRING
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING
    },
    email: {
      unique: true,
      type: Sequelize.STRING
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING
    },
    isVerified: {
      allowNull: false,
      type: Sequelize.BOOLEAN
    },
    // role: {
    //   allowNull: false,
    //   type: Sequelize.ENUM,
    //   defaultValue: 'requester',
    //   values: [
    //     'super_administrator',
    //     'travel_administrator',
    //     'travel_team_member',
    //     'manager',
    //     'requester'
    //   ],
    // },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('Users')
};
