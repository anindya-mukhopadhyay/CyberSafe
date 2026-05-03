import { Server } from 'socket.io';

let ioInstance;

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

  ioInstance.on('connection', (socket) => {
    socket.on('dashboard:join', () => {
      socket.join('admins');
    });

    socket.on('cases:join', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });
  });

  return ioInstance;
};

export const getIO = () => ioInstance;
