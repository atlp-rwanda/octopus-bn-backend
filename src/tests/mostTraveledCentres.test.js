import Chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

Chai.use(chaiHttp);
Chai.should();

describe('Get most traveled destination tests', () => {
  it('logging out', (done) => {
    Chai
      .request(app)
      .delete('/api/v1/auth/logout')
      .end((err, res) => {
        expect(res);
        done();
      });
  });
  it('Should not allow unauthenticated user to see most traveled centres', (done) => {
    Chai
      .request(app)
      .get('/api/v1/accommodations/most-traveled-centres')
      .end((err, res) => {
        res.body.should.have.status(403);
        res.body.should.have.property('error', 'Please log in or sign up to continue');
        done();
      });
  });
  it('It should login successfuly', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'blaiseen@gmail.com',
        password: 'password',
      })
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });

  it('Should return successfully if most traveled centres are found', (done) => {
    Chai
      .request(app)
      .get('/api/v1/accommodations/most-traveled-centres')
      .end((err, res) => {
        res.body.should.have.status(200);
        res.body.should.have.property('message', 'Trending centres are retrieved successfully');
        res.body.should.have.property('data');
        done();
      });
  });
});
