import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import {
  trueAccommodation,
  noName,
  noCountry,
  noCity,
  noImageUrl,
  noAmenities,
  noAround,
  zeroAmenities
} from './mock/accommodationMock';

chai.use(chaiHttp);
const prefix = '/api/v1/accommodations';
describe('User input validation', () => {
  it('should not request trip without login', (done) => {
    chai.request(app).post(`${prefix}`).send(trueAccommodation).end((err, res) => {
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
        email: 'octopusbn@gmail.com',
        password: 'password'
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res);
        done();
      });
  });
  it('should return an error message if accommodation name is not given', (done) => {
    chai.request(app).post(`${prefix}`).send(noName).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should return an error message if accommodation country is not given', (done) => {
    chai.request(app).post(`${prefix}`).send(noCountry).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should return an error message if accommodation city is not given', (done) => {
    chai.request(app).post(`${prefix}`).send(noCity).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should return an error message if accommodation imageUrl is not given', (done) => {
    chai.request(app).post(`${prefix}`).send(noImageUrl).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should return an error message if accommodation amenities is not given', (done) => {
    chai.request(app).post(`${prefix}`).send(noAmenities).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should return an error message if accommodation around is not given', (done) => {
    chai.request(app).post(`${prefix}`).send(noAround).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should return an error message if accommodation zero amenities is not given', (done) => {
    chai.request(app).post(`${prefix}`).send(zeroAmenities).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
  it('should successfully record the accommodation', (done) => {
    chai.request(app).post(`${prefix}`).send(trueAccommodation).end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('status', 201);
      done();
    });
  });
});
