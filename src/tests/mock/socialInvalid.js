const mocks = require('node-mocks-http');

const response = mocks.createResponse();

const invalid = {
  response,
  request: {
    user: {
      id: '12022339534530',
    }
  }
};

export default invalid;
