export default {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [
    {
      userID: '090ec6c6-4884-4ca7-94b1-26a2ed842253',
      firstName: 'Abdoul',
      lastName: 'Nuru',
      method: 'local',
      isVerified: true,
      isUpdated: true,
      email: 'abdoulniyigena@gmail.com',
      password: '$2a$10$JUCGXOZMZUDUHXqRpbdoVuQ.0RuEEV26NKwnZUQJ2K1tE4FwW.nE.',
      role: 'super_administrator',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userID: 'd01cf3f2-4601-4b53-8ffd-fd46b5ded623',
      firstName: 'Izabayo',
      lastName: 'Blaise',
      method: 'local',
      isVerified: true,
      isUpdated: true,
      email: 'needs.grid@gmail.com',
      password: '$2a$10$JUCGXOZMZUDUHXqRpbdoVuQ.0RuEEV26NKwnZUQJ2K1tE4FwW.nE.',
      role: 'requester',
      gender: 'male',
      preferedLang: 'fr',
      birthDate: '1998-02-20',
      preferedCurrency: 'USD',
      residence: 'kimironko',
      managerEmail: 'izabayoblaise82@gmail.com',
      department: 'IT',
      imageUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fman-profile&psig=AOvVaw1-_OdOwQ-SYcfMGvGLOYb4&ust=1582456400155000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOjsvNCD5ecCFQAAAAAdAAAAABAD',
      passportNumber: 'GH1234567',
      bio: 'i love eating a lot. food is bae',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {})
};
