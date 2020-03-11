import Chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

Chai.use(chaiHttp);
Chai.should();

describe('Barefoot nomad should allow marking all notifications as read', () => {
  it('It should login successfuly', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'blaisefr@gmail.com',
        password: 'password',
      })
      .end((err, res) => {
        res.body.should.have.status(200);
        done();
      });
  });

  it('It should mark all unread notifications as read', (done) => {
    Chai
      .request(app)
      .put('/api/v1/notifications/readAll')
      .end((err, res) => {
        res.body.should.have.status(200);
        res.body.should.have.property('message', 'all your unread notifications was marked as read');
        done();
      });
  });
});
