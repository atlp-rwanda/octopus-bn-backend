export default {
  up: (queryInterface) => queryInterface.bulkInsert('Notifications', [
    {
      id: '1',
      receiver: '0e22ed1c-a1a5-4f49-a4ca-000732bfa49o',
      requestID: 'fcbb500e-bbf1-479f-92ea-bb29fb0d28c8',
      type: 'trip request',
      body: 'Rusimbi made a trip request: - From RW - Kigalig to UG - Kampala. Reason: for some reason',
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      receiver: '0e11ed8c-a1a5-4f49-a3ca-450732bfa49o',
      requestID: 'fcbb500e-bbf1-479f-92ea-bb29fb0d28c8',
      type: 'trip request',
      body: 'Rusimbi made a trip request: - From RW - Kigalig to UG - Kampala. Reason: for some reason',
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Notifications', null, {})
};
