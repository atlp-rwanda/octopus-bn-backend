export default {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [
    {
      userID: '090ec6c6-4884-4ca7-94b1-26a2ed842253',
      firstName: 'Abdoul',
      lastName: 'Nuru',
      method: 'local',
      isVerified: true,
      email: 'abdoulniyigena@gmail.com',
      password: '$2a$10$JUCGXOZMZUDUHXqRpbdoVuQ.0RuEEV26NKwnZUQJ2K1tE4FwW.nE.',
      role: 'super_administrator',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {})
};
