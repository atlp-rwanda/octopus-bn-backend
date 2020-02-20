import Chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import {
  user, token, email, role
} from './mock/user.mock';

Chai.use(chaiHttp);
Chai.should();

describe('Barefoot nomad signup tests', () => {
  it.skip('users should be able to create accounts', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.data.should.have.property('email', user.email);
        res.body.data.should.have.property('firstName', user.firstName);
        res.body.data.should.have.property('lastName', user.lastName);
        res.body.should.have.property('message');
        done();
      });
  });

  it.skip('users should be able to verify their accounts', (done) => {
    Chai
      .request(app)
      .get(`/api/v1/auth/verify/${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message', 'Your account is verified, you can now login');
        done();
      });
  });

  it('It should login successfuly', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'abdoulniyigena@gmail.com',
        password: 'password',
      })
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });

  it.skip('User should be assigned roles', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/assign-roles')
      .send({ email, role })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message', `Your role was upgraded to ${role}`);
        done();
      });
  });

  it('Do not assign roles to users who don\' exist', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/assign-roles')
      .send({ email: 'jim@gmail.com', role })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error', 'The User you are assigning the role to don\'t exist');
        done();
      });
  });
});
