const mocks = require('node-mocks-http');

const response = mocks.createResponse();

const facebookMock = {
  response,
  request: {
    user: {
      id: '120223229534530',
      lastName: 'Blaise',
      firstName: 'Leon',
      email: 'izabayoblaise82@gmail.com',
      method: 'facebook',
    }
  }
};

export default facebookMock;
