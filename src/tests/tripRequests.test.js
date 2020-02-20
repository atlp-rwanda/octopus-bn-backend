
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import { tripRequestsMock, wrongTrip } from './mock/tripRequestsMock';

chai.use(chaiHttp);

describe('trips', () => {
  it('should logout user', (done) => {
    chai
      .request(app)
      .delete('/api/v1/auth/logout')
      .end((err, res) => {
        expect(res);
        done();
      });
  });
  it('should not request trip without login', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .send(tripRequestsMock)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Please log in or sign up to continue');
        expect(res);
        done();
      });
  });
  it('should sign in a user first', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'octapususer@andela.com',
        password: 'password',
      })
      .end((err, res) => {
        expect(res);
        done();
      });
  });
  it('It should not allow request trip without providing data', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .send(wrongTrip)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });
  it('It should request trip successfully', (done) => {
    chai
      .request(app)
      .post('/api/v1/trips/request')
      .send(tripRequestsMock)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'message', 'data');
        expect(res.body.status).to.be.equal(201);
        expect(res.body.message).to.be.equal('Travel request successfully created');
        expect(res);
        done();
      });
  });
});
