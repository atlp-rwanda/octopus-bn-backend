const mocks = require('node-mocks-http');

const response = mocks.createResponse();

const googleMock = {
  response,
  request: {
    user: {
      id: '105366742150310895902',
      lastName: 'Izabayo',
      firstName: 'Blaise',
      email: 'izabayoblaise82@gmail.com',
      method: 'google',
    }
  }
};


export default googleMock;
