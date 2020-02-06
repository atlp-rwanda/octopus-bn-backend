export default {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [{
    firstName: 'Octapus',
    lastName: 'Octapus',
    email: 'octapus@andela.com',
    createdAt: new Date(),
    updatedAt: new Date()
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {})
};
