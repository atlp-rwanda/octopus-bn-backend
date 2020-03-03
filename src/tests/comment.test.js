import chai, {
  expect
} from 'chai';
import chaiHttp from 'chai-http';
import {
  describe,
  it
} from 'mocha';
import app from '../index';

chai.use(chaiHttp);
const prefix = '/api/v1/requests/comments';
const id = '46e9bfdf-6d21-4fd8-8fc7-df654d615be1';

describe('', () => {
  it('should sign in a user first', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'needs.grid@gmail.com',
        password: 'password'
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res);
        done();
      });
  });
  it('should not allow someone to comment on a travel request with no comment provided', (done) => {
    chai.request(app).post(`${prefix}?requestId=${id}`).end((err, res) => {
      expect(res.body.status).to.be.equal(400);
      expect(res);
      done();
    });
  });
  it('should not allow someone to comment on a travel request with a wrong ID', (done) => {
    chai
      .request(app)
      .post(`${prefix}?requestId=121212129jj2n2nbd`)
      .send({
        comment: "hello, i thought that was the way it's supposed to be"
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res);
        done();
      });
  });
  it('should not allow someone to comment on a travel request which does not belong to him', (done) => {
    chai
      .request(app)
      .post(`${prefix}?requestId=48e9bfdf-6d21-4fd8-8fc7-df654d615be1`)
      .send({
        comment: "hello, i thought that was the way it's supposed to be"
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res);
        done();
      });
  });
  it('should allow someone to comment on a travel request', (done) => {
    chai
      .request(app)
      .post(`${prefix}?requestId=${id}`)
      .send({
        comment: "hello, i thought that was the way it's supposed to be"
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(201);
        expect(res);
        done();
      });
  });
});
