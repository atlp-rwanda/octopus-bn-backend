export default {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [
    {
      userID: '1232123232112',
      firstName: 'Octapus',
      lastName: 'Octapus',
      method: 'facebook',
      isVerified: true,
      email: 'octapus@andela.com',
      password: '$2a$10$JUCGXOZMZUDUHXqRpbdoVuQ.0RuEEV26NKwnZUQJ2K1tE4FwW.nE.',
      role: 'requester',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userID: '123212985492',
      firstName: 'Octapus',
      lastName: 'Octapus',
      method: 'local',
      isVerified: false,
      email: 'octopususer@andela.com',
      password: '$2a$10$JUCGXOZMZUDUHXqRpbdoVuQ.0RuEEV26NKwnZUQJ2K1tE4FwW.nE.',
      role: 'requester',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userID: '0e11ed8c-a1a5-4f49-a3ca-450769bfa49o',
      firstName: 'Octapuses',
      lastName: 'Jean',
      method: 'seed',
      isVerified: true,
      email: 'a@andela.com',
      password: 'dededenfefeefe',
      role: 'requester',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userID: 'd0a051d9-447a-49a8-aebc-7e1b031afd62',
      method: 'local',
      firstName: 'Octopus',
      lastName: 'Octopus',
      email: 'octopus@andela.com',
      password: '$2a$10$JUCGXOZMZUDUHXqRpbdoVuQ.0RuEEV26NKwnZUQJ2K1tE4FwW.nE.',
      role: 'requester',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {})
};
