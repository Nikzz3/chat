import { Server } from 'socket.io';
import { Message } from '../../utils/Message';

let messages: Message[] = [];

export default defineNitroPlugin((nitro) => {
  const socketServer = new Server(useRuntimeConfig().public.socketPort, {
    serveClient: false,
    cors: {
      origin: '*',
    },
  });

  socketServer.on('connection', (socket: any) => {
    socket.emit(SocketEvent.messages, messages);

    socket.on(SocketEvent.newMessage, (message: Message) => {
      messages.push(message);
      socketServer.sockets.emit(SocketEvent.messages, messages);
    });
  });
});
