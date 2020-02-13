export default {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [{
    userID: 'd0a051d9-447a-49a8-aebc-7e1b031afd62',
    method: 'local',
    firstName: 'Octopus',
    lastName: 'Octopus',
    email: 'octopus@andela.com',
    password: '$2y$10$nY8Ke8P1ugVFw8jHImzpEeR2rRkcRu9IxPzlOXkrziBCHWHX7Rl7G',
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }]),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {})
};
