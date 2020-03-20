import Chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import sinon from 'sinon';
import sendGrid from '@sendgrid/mail';
import { onlineClients } from '../utils/socket';
import io from 'socket.io-client';
import {
  userCredentials,
  updatedTripRequest,
  validTripId
} from './mock/editTripRequestMock';

Chai.use(chaiHttp);
Chai.should();

describe('Editing a trip request', () => {
  it('should sign in a user first', (done) => {
    Chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send(userCredentials)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res);
        done();
      });
  });
  it('should edit trip request like so', (done) => {
    Chai
      .request(app)
      .patch(`/api/v1/trips/${validTripId}`)
      .send(updatedTripRequest)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Your trip request has been successfully edited!');
        expect(res);
        done();
      before(async () => {
        const socketURL = 'http://localhost:3000';
    
        const options = {
          transports: ['websocket'],
          'force new connection': true
        };
    
        const client = io.connect(socketURL, options);
        client.on('connect', () => {
          client.emit('connect_user', '0e22ed1c-a1a5-4f49-a4ca-000732bfa49o');
        });
        await onlineClients.set('0e22ed1c-a1a5-4f49-a4ca-000732bfa49o');
        sinon.stub(sendGrid, 'send').returns({
          to: 'itsafact57@gmail.com',
          from: 'barefoot@noreply',
          subject: 'New trip request',
          text: 'Hello, Octopus.',
          html: 'emailTemplate'
        });
      });
      after(() => {
        sinon.restore();
      });
      it('should edit trip request like so', (done) => {
        Chai
          .request(app)
          .patch(`/api/v1/trips/${validTripId}`)
          .send(updatedTripRequest)
          .end((err, res) => {
            expect(res.body.status).to.be.equal(200);
            expect(res.body.message).to.be.equal('Your trip request has been successfully edited!');
            expect(res);
            done();
          });
      });
  });
});
});
