import Chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import {
  invalidUuid, managerCredentials,
  nonExistTripId, tripIdNotAssigned,
  rejectedTripId, approvedRequestId,
  assignedPendingRequest
} from './mock/rejectTripMock';

Chai.use(chaiHttp);
Chai.should();

describe('Rejecting a trip request', () => {
  it('should not allow non-manager users', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${invalidUuid}/reject`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Please you should be a manager');
        done();
      });
  });

  it('It should login auth successfuly', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(managerCredentials)
      .end((err, res) => {
        expect(res.body).to.have.keys('status', 'message', 'token');
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('User login successfully');
        expect(res);
        done();
      });
  });
  it('should fail when trip request ID is not valid', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${invalidUuid}/reject`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Please use a valid trip request ID');
        done();
      });
  });
  it('should fail when trip request ID is not found', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${nonExistTripId}/reject`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.be.equal('Trip request is not found');
        done();
      });
  });
  it('should fail when trip request is not assigned to manager', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${tripIdNotAssigned}/reject`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Trip is not assigned to you!');
        done();
      });
  });
  it('should deny when trip is already rejected', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${rejectedTripId}/reject`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Trip has been already rejected!');
        done();
      });
  });
  it('should not reject approved trip request', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${approvedRequestId}/reject`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('You not allowed to reject approved trip request');
        done();
      });
  });
  it('should reject the trip request', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${assignedPendingRequest}/reject`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Trip request is successfuly rejected');
        done();
      });
  });
});
