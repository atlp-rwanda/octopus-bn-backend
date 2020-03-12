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

const trueRatings = {
	"accommodationId":"c8e9428a-6d60-4083-8ce3-334c62afe72c",
	"rating": 3
}
chai.use(chaiHttp);
const prefix = '/api/v1/accommodations';
describe('RATE ACCOMMODATIONS', () => {
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
  it('should rate an accommodation successfully', (done) => {
    chai.request(app).post(`${prefix}/rating`).send(trueRatings).end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('status', 201);
      done();
    });
  });
  it('should update ratings successfully', (done) => {
    chai.request(app).post(`${prefix}/rating`).send(trueRatings).end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('status', 200);
      done();
    });
  });
  it('should not rate without proving data', (done) => {
    chai.request(app).post(`${prefix}/rating`).end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('status', 400);
      done();
    });
  });
});
