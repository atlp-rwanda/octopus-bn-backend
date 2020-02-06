import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';

chai.use(chaiHttp);
describe('SERVER CONFIG CHECK', () => {
  it('Should check development error handler', (done) => {
    chai
      .request(app)
      .get('/wrong')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.have.property('error');
        expect(res.body.errors).to.have.property('message', 'Not Found');
        done();
      });
  });
});
