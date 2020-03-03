
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';

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
  it('should not do the search with no user logged in', (done) => {
    chai
      .request(app)
      .get('/api/v1/trips/search?searchKey=needs')
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
        email: 'blaiseen@gmail.com',
        password: 'password',
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res);
        done();
      });
  });
  it('Should not allow search with wrong page and limits for pagination', (done) => {
    chai
      .request(app)
      .get('/api/v1/trips/search?page=-1&limit=-5&searchKey=needs')
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });

  it('Should return search trip successfully', (done) => {
    chai
      .request(app)
      .get('/api/v1/trips/search?searchKey=needs')
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'message', 'data', 'info');
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Requests retrieved successfully');
        expect(res);
        done();
      });
  });
});
