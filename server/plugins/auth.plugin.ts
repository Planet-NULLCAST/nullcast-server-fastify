import {FastifyInstance} from 'fastify';
import auth from 'fastify-auth';
import authHandler from '../auth/auth.handler';

export function fastifyAuthPlugin(server: FastifyInstance) {
  server.register(auth).after(() => {authHandler(server);});
}
