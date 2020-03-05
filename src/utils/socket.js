import soket from 'socket.io';

const onlineClients = new Map();
const socketio = (server) => {
  const io = soket(server);
  io.on('connection', (socket) => {
    socket.on('connect_user', (userKey) => {
      onlineClients.set(userKey.toString(), socket);
    });
  });
  return io;
};
export { socketio, onlineClients };
