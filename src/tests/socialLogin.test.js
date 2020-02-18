import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../index';
import userController from '../controllers/userController';
import Models from '../database/models';
import facebookMock from './mock/facebookMock';
import googleMock from './mock/googleMock';

import invalid from './mock/socialInvalid';

chai.use(chaiHttp);

const { Users } = Models;

const prefix = '/api/v1/auth';
describe('Social Authentication', () => {
  it('should test facebook redirect route', (done) => {
    chai
      .request(app)
      .get(`${prefix}/facebook`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should save data facebook data into the database', async () => {
    const { email } = facebookMock.request.user;
    await userController.socialLogin(facebookMock.request, facebookMock.response);
    const user = await Users.findOne({ where: { email } });
    expect(email).to.be.equal(user.email);
  });
  it('should save data google data into the database', async () => {
    const { email } = googleMock.request.user;
    await userController.socialLogin(googleMock.request, googleMock.response);
    const user = await Users.findOne({ where: { email } });
    expect(email).to.be.equal(user.email);
  });
  it('should fail if req.user have no required data', async () => {
    const data = await userController.socialLogin(invalid.request, invalid.response);
    expect(data.statusCode).to.be.equal(500);
  });
});
