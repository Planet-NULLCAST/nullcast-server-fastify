import * as controller from '../../controllers/index';
import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';
import { ValidateUser } from 'interfaces/user.type';
import { logoutSchema, signInSchema } from '../../route-schemas/auth/auth.schema';

const getNewToken: RouteOptions = {
  method: 'GET',
  url: '/token',
  handler: (request, reply) => {
    if (request.cookies && request.cookies.token) {
      const token = request.cookies.token as string;
      const userToken = controller.generateNewTokenController(token);
      if (userToken) {
        reply.setCookie('token',
          userToken,
          { signed: false, domain: '', path: '/', secure: true, httpOnly: true, maxAge: 86400, sameSite: 'none' });
        reply.code(200).send();
      }
    }
    reply.code(401).send({ message: 'Cannot issue new token. Token provided is not valid' });
  }
};

const signIn: RouteOptions = {
  method: 'POST',
  url: '/signin',
  schema: signInSchema,
  handler: async(request, reply) => {
    const userData = await controller.signInUserController(request.body as ValidateUser);
    if (userData?.token) {
      reply.setCookie('token', userData.token,
        { signed: false, domain: '', path: '/', secure: true, httpOnly: true, maxAge: 86400, sameSite: 'none' });
      reply.code(200).send({ message: 'User logged in successfully', user: userData.user });
      return;
    }
    reply.code(401).send({ message: 'Invalid username or password' });
  }
};

const logOut: RouteOptions = {
  method: 'POST',
  url: '/logout',
  schema: logoutSchema,
  handler: async(_request, reply) => {
    reply.setCookie('token', '', { signed: false, domain: '', path: '/', secure: true, httpOnly: true, maxAge: 0, sameSite: 'none' });
    reply.code(200).send({ message: 'User logged out successfully' });
  }
};

function initTokensRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.route(getNewToken);
  server.route(signIn);
  server.route(logOut);

  done();
}

export default initTokensRoutes;
