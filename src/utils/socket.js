import { decode } from 'utils/jwtTokenizer';
import Models from '../database/models';

const { Chats, Users } = Models;

export const checkUser = async (socket) => {
  try {
    const { token } = socket.handshake.query;
    const data = await decode(token);
    const { email } = data;
    if (!data) {
      socket.emit('authentication_error', 'invalid info provided');
    }
    const user = await Users.findOne({ where: { email } });

    return user;
  } catch (error) {
    socket.emit('custom_error', 'invalid info provided');
  }
};

export const saveMessage = async (io, socket, message, user) => {
  const saved = await Chats.create({
    message,
    userId: user.id,
  });
  io.emit('chat_message', `<strong>${socket.username}</strong>: ${message}`);
};

const onlineClients = new Map();
const socketio = async (io) => {
  const connectedSockets = [];
  io.on('connection', async (socket) => {
    socket.on('connect_user', (userKey) => {
      onlineClients.set(userKey.toString(), socket);
    });

    try {
      const user = await checkUser(socket);
      if (user) {
        socket.on('username', async () => {
          socket.username = `${user.firstName} ${user.lastName}`;
          socket.image = user.imageUrl;
          io.emit('is_online', `<p class='onlineStatus'></p> <i>${socket.username} join the chat..</i>`);
        });
      }

      const found = connectedSockets.find((item) => item.id === user.id);
      if (!found) {
        connectedSockets.push({
          id: user.id,
          image: user.imageUrl,
          role: user.role,
          username: `${user.firstName} ${user.lastName}`
        });
      }

      socket.broadcast.emit('new_connected', connectedSockets);

      socket.on('connected_clients', (nothing, cb) => {
        cb(connectedSockets);
      });

      socket.on('disconnect', (username) => {
        const index = connectedSockets.indexOf(connectedSockets.find((item) => item.id === user.id));
        if (index > -1) {
          connectedSockets.splice(index, 1);
        }
        socket.broadcast.emit('new_disconnected', connectedSockets);
        io.emit('is_online', `<p class='offStatus'></p> <i>${socket.username} left the chat..</i>`);
      });

      socket.on('chat_message', async (message) => {
        await saveMessage(io, socket, message, user);
      });
      // socket.broadcast.emit('typing', user.firstName);

      await Chats.findAll({
        include: [{
          model: Users,
          attributes: ['firstName', 'lastName']
        }]
      }).then((data) => {
        socket.emit('chat_history', data);
      });
    } catch (error) {
      return socket.emit('custom_error', 'invalid info provided');
    }
  });
  return io;
};
export { socketio, onlineClients };
