export default {
  up: (queryInterface) => queryInterface.bulkInsert('Accommodations', [
    {
      id: 'c8e9428a-6d60-4083-8ce3-334c62afe72c',
      name: 'victoria blue hotels & apartments',
      country: 'rw',
      city: 'Kigali',
      createdBy: 'd01cf3f2-4601-4b53-8ffd-fd46b6ded623',
      imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      amenities: `{"${JSON.stringify({
        example: 'Diego'
      }).replace(/"/g, '\\"')}", "${JSON.stringify({
        example: '10 smoke-free homes'
      }).replace(/"/g, '\\"')}"}`,
      around: `{"${JSON.stringify({
        example: 'Restaurant and bar/lounge'
      }).replace(/"/g, '\\"')}", "${JSON.stringify({
        example: 'Pacho'
      }).replace(/"/g, '\\"')}"}`,
      updatedAt: '2020-03-02T16:13:40.844Z',
      createdAt: '2020-03-02T16:13:40.844Z'
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Accommodations', null, {})
};
