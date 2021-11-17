import socketIo from 'fastify-socket.io';
import { FastifyInstance } from 'fastify';

export default function fastifyCookiePlugin(server: FastifyInstance) {
  server.register(socketIo, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
}
