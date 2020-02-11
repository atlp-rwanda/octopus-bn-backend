import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';

chai.use(chaiHttp);
const prefix = '/api/v1/auth';

describe('User input validation', () => {
  it('should return an error message if firstName is not given', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        lastName: 'johanes',
        email: 'email@gmail.com',
        password: 'test123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['First name is required']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message when the firstName isn\'t only letter', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'wess12*',
        lastName: 'johanes',
        email: 'email@gmail.com',
        password: 'test123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['First name must only contain letters']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message if lastName is not given', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        email: 'email@gmail.com',
        password: 'test123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['Last name is required']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message when the lastName isn\'t only letter', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'wess',
        lastName: 'johanes12',
        email: 'email@gmail.com',
        password: 'test123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['Last name must only contain letters']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message if email is not given', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        lastName: 'mukudwa',
        password: 'test123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['email is required']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message if email provided is invalid', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        lastName: 'mukudwa',
        email: '234.',
        password: 'test123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['email should be valid']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message if email is already taken', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        lastName: 'mukudwa',
        email: 'octopus@andela.com',
        password: 'test123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal('email already taken');
        expect(res.body).to.have.property('status', 409);
        done();
      });
  });
  it('should return an error message if password is not given', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        lastName: 'mukudwa',
        email: 'jean@gmail.com'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['Password is required']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message if password is not only alphanumeric', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        lastName: 'mukudwa',
        email: 'jean@gmail.com',
        password: '*23224@343df',
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['Password must be alphanumeric']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
  it('should return an error message if password length is less than 8', (done) => {
    chai
      .request(app)
      .post(`${prefix}/signup`)
      .send({
        firstName: 'johanes',
        lastName: 'mukudwa',
        email: 'jean@gmail.com',
        password: '243df',
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.deep.equal(['password length must be longer than 8']);
        expect(res.body).to.have.property('status', 422);
        done();
      });
  });
});
