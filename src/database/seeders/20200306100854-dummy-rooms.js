export default {
  up: (queryInterface) => queryInterface.bulkInsert('Rooms', [
    {
      id: 'f1098fbf-fb64-422e-9133-57aee90ac75c',
      accommodationsID: '49235c57-2153-4e65-8b2b-68c0502165ab',
      roomNumber: 'H223',
      cost: 200,
      currency: 'USD',
      type: 'Single',
      status: true,
      createdBy: 'd01cf3f2-4601-4b53-8ffd-fd46b6ded623',
      updatedAt: '2020-03-02T16:13:40.844Z',
      createdAt: '2020-03-02T16:13:40.844Z'
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Rooms', null, {})
};
