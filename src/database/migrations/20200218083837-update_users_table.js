/* eslint-disable no-useless-escape */

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query("CREATE TYPE \"enum_Users_role\" AS ENUM(\'super_administrator\',\'accommodation_supplier\', \'travel_administrator\', \'travel_team_member\', \'manager\', \'requester\'); ALTER TABLE \"Users\" ADD COLUMN \"role\" \"enum_Users_role\";");
  },

  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TYPE "enum_Users_role" CASCADE');
  }
};
