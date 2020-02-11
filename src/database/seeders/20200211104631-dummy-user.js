export default {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [{
    userID: '0e11ed8c-a1a5-4f49-a3ca-450769bfa49o',
    firstName: 'Octapuses',
    lastName: 'Jean',
    method: 'seed',
    isVerified: true,
    email: 'a@andela.com',
    password: 'dededenfefeefe',
    createdAt: new Date(),
    updatedAt: new Date()
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {})
};
