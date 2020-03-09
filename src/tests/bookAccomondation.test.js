import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import {
  accomoIdNotFound,
  roomIdNotFound,
  tripNotFound,
  safeBooking,
  logincredentials
} from './mock/bookAccomondation';

chai.use(chaiHttp);
const prefix = '/api/v1/accommodations/book';
describe('Booking accommondation', () => {
  it('should sign in a user first', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(logincredentials)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res);
        done();
      });
  });
  it('should return accommondation is successfully booked', (done) => {
    chai.request(app).post(`${prefix}`).send(safeBooking).end((err, res) => {
      expect(res.body).to.have.keys('status', 'message');
      expect(res.body.status).to.be.equal(201);
      expect(res.body.message).to.be.equal('You have successfully booked your accommodation');
      expect(res);
      done();
    });
  });
  it('should return not found when accomondation does not exist', (done) => {
    chai.request(app).post(`${prefix}`).send(accomoIdNotFound).end((err, res) => {
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.be.equal(404);
      expect(res.body.error).to.be.equal('Accomondation id is not found');
      expect(res);
      done();
    });
  });
  it('should return not found when room is not available', (done) => {
    chai.request(app).post(`${prefix}`).send(roomIdNotFound).end((err, res) => {
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.be.equal(404);
      expect(res.body.error).to.be.equal('Room id is not found');
      expect(res);
      done();
    });
  });
  it('should return not found when a trip request is not available', (done) => {
    chai.request(app).post(`${prefix}`).send(tripNotFound).end((err, res) => {
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.be.equal(404);
      expect(res.body.error).to.be.equal('Trip request is not found');
      expect(res);
      done();
    });
  });
});
