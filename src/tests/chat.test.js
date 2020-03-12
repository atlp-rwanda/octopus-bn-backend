import io from 'socket.io-client';
import http from 'http';
import ioBack from 'socket.io';
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { encode } from '../utils/jwtTokenizer';
import { socketio } from '../utils/socket';

let socket, socket1, socket2;
let httpServer;
let ioServer;
const token = encode({
  email: 'PO@gmail.com',
  preferedLang: 'en'
});
const token1 = encode({
  email: 'ocoptusbn@gmail.com',
  preferedLang: 'en'
});
const port = process.env.NODE_PORT || 8723;
chai.use(chaiHttp);


const prefix = '/api/v1/auth';
describe('Chat testing', () => {
  before((done) => {
    httpServer = http.createServer().listen(port);
    ioServer = ioBack(httpServer);
    done();
  });

  after((done) => {
    ioServer.close();
    httpServer.close();
    done();
  });

  describe('authenticated users chat', () => {
    beforeEach((done) => {
      socketio(ioServer);
      socket = io.connect(`http://0.0.0:${port}`, {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
        query: { token }
      });
      socket1 = io.connect(`http://0.0.0:${port}`, {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
        query: { token1 }
      });
      socket.on('connect', () => {
        done();
      });
    });

    afterEach((done) => {
      if (socket.connected) {
        socket.disconnect();
      }
      if (socket1.connected) {
        socket1.disconnect();
      }
      done();
    });

    it('confirm if sockets works', (done) => {
      ioServer.emit('echo', 'Hello World');
      socket.once('echo', (message) => {
        expect(message).equal('Hello World');
        done();
      });
    });

    it('client should be to get all prior messages', (done) => {
      socket.once('connection', () => {
        socket.emit('chat_history');
      });
      socket.once('chat_history', (data) => {
        expect(data).to.be.an('array');
        done();
      });
    });
  });
});
