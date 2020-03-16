import Chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import {
  userCredentials,
  updatedTripRequest,
  validTripId
} from './mock/editTripRequestMock';

Chai.use(chaiHttp);
Chai.should();

describe('Editing a trip request', () => {
  it('should sign in a user first', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(userCredentials)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res);
        done();
      });
  });
  it('should edit trip request like so', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .send(updatedTripRequest)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Your trip request has been successfully edited!');
        expect(res);
        done();
      });
  });
});
