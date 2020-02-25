const mocks = require('node-mocks-http');

const response = mocks.createResponse();

const notMoch = {
  response,
  request: {
    body: {
    }
  }
};

export default notMoch;
