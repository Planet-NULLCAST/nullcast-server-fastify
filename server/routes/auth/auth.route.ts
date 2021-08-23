import * as controller from '../../controllers/index';
import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';
import { ValidateUser } from 'interfaces/user.type';
import { signInSchema } from '../../route-schemas/auth/auth.schema';

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

const signIn: RouteOptions = {
  method: 'POST',
  url: '/signin',
  schema: signInSchema,
  handler: async(request, reply) => {
    const res = await controller.validateUserController(request.body as ValidateUser);
    if (res) {
      reply.code(200).send(res);
    } else {
      reply.code(500);
    }
  }
};

function initTokensRoutes(server:FastifyInstance, _:any, done: () => void) {
  server.route(getNewToken);
  server.route(signIn);

  done();
}

export default initTokensRoutes;
