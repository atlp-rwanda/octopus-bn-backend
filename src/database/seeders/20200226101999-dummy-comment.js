export default {
	up: (queryInterface) =>
		queryInterface.bulkInsert('Comments', [
			{
				id: 'c8e9428a-6d60-4083-8ce3-334c62afe72c',
        userID: 'd01cf3f2-4601-4b53-8ffd-fd46b5ded623',
        requestId: '46e9bfdf-6d21-4fd8-8fc7-df654d615be1',
				comment: 'i am a comment test me',
				updatedAt: '2020-03-02T16:13:40.844Z',
				createdAt: '2020-03-02T16:13:40.844Z'
			}
		]),
	down: (queryInterface) => queryInterface.bulkDelete('Comments', null, {})
};
