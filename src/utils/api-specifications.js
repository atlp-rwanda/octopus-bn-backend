import path from 'path';
import os from 'os';
import renderContent from './international';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Barefoot Nomad',
      version: '1.0.0',
      description: `${renderContent('en').__('AppDesc')}`,
      license: {},
      contact: {}
    },
    components: {},
    security: {},
    servers: [
      {
        url: 'http://localhost:3000',
        name: `${os.hostname()}`
      },
      {
        url: `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`,
        name: `${os.hostname()}`
      }
    ]
  },
  apis: [
    path.resolve(__dirname, '../routes/api/*.js')
  ],
};

export default swaggerOptions;
