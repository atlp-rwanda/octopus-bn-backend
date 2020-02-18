import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import sendGrid from '@sendgrid/mail';
import app from '../index';
import { mockToken, unRegisteredToken } from './mock/jwtTokenizer.mock';

chai.use(chaiHttp);
describe('Reset password tests', () => {
  before(() => {
    sinon.stub(sendGrid, 'send').returns({
      to: 'rusimbipatrick@outlook.com',
      from: 'barefoot@noreply',
      subject: 'Barefoot Nomad Password rest',
      text: 'Hello, Octopus.',
      html: 'emailTemplate'
    });
  });
  it('It should send a reset password link yo a user as an email', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/forgot-password')
      .send({
        email: 'rusimbipatrick@outlook.com',
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'message');
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('We have sent you an email');
        expect(res);
        done();
      });
  });
  it('It should a reset password', (done) => {
    chai
      .request(app)
      .put(`/api/v1/auth/reset-password/${mockToken}`)
      .send({
        email: 'rusimbipatrick@outlook.com',
        password: 'thisisnew',
        confirmPassword: 'thisisnew'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'message');
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Password reset succesfully');
        expect(res);
        done();
      });
  });
  it('It should return an error when new password and confirm password', (done) => {
    chai
      .request(app)
      .put(`/api/v1/auth/reset-password/${mockToken}`)
      .send({
        email: 'rusimbipatrick@outlook.com',
        password: 'thisisnew',
        confirmPassword: 'notmatching'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(422);
        expect(res.body.error).to.be.equal('Passwords do not match');
        expect(res);
        done();
      });
  });

  it('It should return an error user provides an unregistered email', (done) => {
    chai
      .request(app)
      .put(`/api/v1/auth/reset-password/${unRegisteredToken}`)
      .send({
        password: 'thisisnew',
        confirmPassword: 'thisisnew'
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.be.equal('The provided email don\'t exist, create an account');
        done();
      });
  });

  it('It should return an error user provides an unregistered email', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/forgot-password/')
      .send({
        email: 'notregistered@andela.com',
      })
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.be.equal('The provided email don\'t exist, create an account');
        done();
      });
  });
});
