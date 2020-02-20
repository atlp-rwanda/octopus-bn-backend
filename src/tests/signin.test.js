
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';

chai.use(chaiHttp);
describe('Sign in tests', () => {
  it('It should login auth successfuly', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'octopususer@andela.com',
        password: 'password',
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'message', 'token');
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Successfully logged in');
        expect(res);
        done();
      });
  });

  it('It should show an error if the user tries to sign in with invalid credentials', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'wrong.email@wrong.com',
        password: 'wrong',
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(401);
        expect(res.body.error).to.be.equal('Incorrect username or password combination');
        expect(res.body.error).to.be.a('string');
        expect(res);
        done();
      });
  });

  it('It should show an error if the uses uses Open Auth', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'octapus@andela.com',
        password: '',
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error).to.be.equal('Please use facebook to sign in');
        expect(res.body.error).to.be.a('string');
        expect(res);
        done();
      });
  });
});
