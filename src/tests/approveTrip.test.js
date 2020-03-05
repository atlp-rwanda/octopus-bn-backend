/* eslint-disable import/no-extraneous-dependencies */
import Chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import {
  invalidUuid, managerCredentials,
  nonExistTripId, tripIdNotAssigned,
  approvedRequestId
} from './mock/rejectTripMock';
import { tripInpendingMode, WithNoManagerRole, rejectedTripId } from './mock/approveTripMock';

Chai.use(chaiHttp);
Chai.should();

describe('Approving a trip request', () => {
  it('should sign in a user first', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(WithNoManagerRole)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res);
        done();
      });
  });

  it('should not allow non-manager users to approve a trip', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${invalidUuid}/approve`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Please you should be a manager');
        done();
      });
  });

  it('It should login manager successfuly', (done) => {
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
      .put(`/api/v1/trips/${invalidUuid}/approve`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Please use a valid trip request ID');
        done();
      });
  });
  it('should fail when trip request ID is not found', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${nonExistTripId}/approve`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.be.equal('Trip request is not found');
        done();
      });
  });
  it('should fail when trip request is not assigned to manager', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${tripIdNotAssigned}/approve`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Trip is not assigned to you!');
        done();
      });
  });
  it('should deny when trip is already rejected', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${rejectedTripId}/approve`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Trip has been already rejected!');
        done();
      });
  });
  it('should not fire up approval when a trip is already approved', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${approvedRequestId}/approve`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body.error).to.be.equal('Trip has been already approved');
        done();
      });
  });
  it('should approve the trip request', (done) => {
    Chai
      .request(app)
      .put(`/api/v1/trips/${tripInpendingMode}/approve`)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Trip request is successfully approved');
        done();
      });
  });
});
