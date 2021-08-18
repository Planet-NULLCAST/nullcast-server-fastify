import controller from '../../controllers/index';import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

const getNewToken: RouteOptions = {
  method: 'GET',
  url: '/token',
  handler: (request, reply) => {
    if (request.cookies && request.cookies.token) {
      const token = request.cookies.token as string;
      const userToken = controller.generateNewTokenController(token);
      if (userToken) {
        reply.setCookie('token', userToken, {signed: false});
        reply.code(200).send();
      }
    }
    reply.code(401).send({message: 'Cannot issue new token. Token provided is not valid'});
  }
};

function initTokens(server:FastifyInstance, _:any, done: () => void) {
  server.route(getNewToken);

  done();
}

export default initTokens;
