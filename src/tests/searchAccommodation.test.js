import Chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

Chai.use(chaiHttp);
Chai.should();

describe('Barefoot nomad should allow to search for accommodations', () => {
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

  it('It should show accommodation search results if a user is logged in', (done) => {
    Chai
      .request(app)
      .get('/api/v1/accommodations/search?page=1&limit=5&searchKey=Kampala')
      .end((err, res) => {
        res.body.should.have.status(200);
        res.body.should.have.property('message', 'Accommodation search results');
        done();
      });
  });
});
