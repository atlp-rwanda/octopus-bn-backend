import Chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { cities, wrongCities } from './mock/multiCityMock';

Chai.use(chaiHttp);
Chai.should();

describe('Barefoot nomad should allow managers to see the pending requests of users they manage', () => {
  it('It should login successfuly', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'needs.grid@gmail.com',
        password: 'password',
      })
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });

  it('It should login successfuly', (done) => {
    Chai
      .request(app)
      .get('/api/v1/trips/avail-requests')
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });
});
