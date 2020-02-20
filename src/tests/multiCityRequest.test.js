import Chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { cities, wrongCities } from './mock/multiCityMock';

Chai.use(chaiHttp);
Chai.should();

describe('Barefoot nomad should allow multi city trips', () => {
  it('It should login successfuly', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'octopus@andela.com',
        password: 'password',
      })
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });

  it('It should send a multi city trip request', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .send(cities)
      .end((err, res) => {
        res.body.should.have.status(201);
        res.body.should.have.property('message', 'Your multi city trip request has been recorded');
        done();
      });
  });

  it('It should not send a multi city trip request if there are validation errors', (done) => {
    Chai
      .request(app)
      .post('/api/v1/trips/multi-city')
      .send(wrongCities)
      .end((err, res) => {
        res.body.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });
});
