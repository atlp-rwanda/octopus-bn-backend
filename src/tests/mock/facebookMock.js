const mocks = require('node-mocks-http');

const response = mocks.createResponse();

const facebookMock = {
  response,
  request: {
    user: {
      id: '120223229534530',
      lastName: 'Blaise',
      firstName: 'Leon',
      email: 'izabayoblaise81@gmail.com',
      method: 'facebook',
      isUpdated: true
    }
  }
};

export default facebookMock;
