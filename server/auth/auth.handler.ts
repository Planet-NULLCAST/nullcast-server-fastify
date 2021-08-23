import {FastifyInstance, FastifyRequest} from 'fastify';
import * as controller from '../controllers';
import { NON_AUTH_ROUTES } from 'constants/non-auth-routes';
import { verifyToken } from 'utils/jwt.utils';

function authHandler(server: FastifyInstance) {
  server.addHook('preHandler', server.auth([verifyRoute, jwtAuth, basicAuth]));
}

/**
 * Verifies the route whether to run authentication or not
 * @param request Fastify request instance
 * @param _ Fastify reply instance
 * @param done - to initiate next auth strateguy or pass auth.
 */

async function verifyRoute(request: FastifyRequest) {

  // removing the user data if someone sends it along with a request
  if (request.user) {
    request.user = null;
  }

  if (request.cookies && request.cookies.token) {
    throw new Error('Token exists, validating the token');
  }
  if (request.method === 'GET') {
    // console.log('Auth skipped for GET request');
    return;
  }
  const endpoint =  request.url.split('/')[3];
  if (NON_AUTH_ROUTES[endpoint as string] && NON_AUTH_ROUTES[endpoint as string] === request.method) {
    return;
  }
  throw new Error('');
}

async function basicAuth(request: FastifyRequest) {

  const authData = request.headers.authorization as string;
  if (!authData) {
    // console.log('authorization data not found. Escaping auth for now');
    throw new Error('Auth failed');
  }

  const authString = authData.split(' ')[1];

  if (authString) {
    const buffer = Buffer.from(authString, 'base64');
    const [username, password] = buffer.toString('utf-8').split(':');

    if (username && password) {
      const validated = await controller.validateUserController({
        user_name: username as string,
        password: password as string
      });

      if (validated) {
        console.log('user exist in DB');
        request.user = {
          user_name: username
        };
        return;
      }
      throw new Error('Auth failed');
      // console.log('Auth escaped for now');

      // return;
    }
  }

  throw new Error('Auth failed');
}

async function jwtAuth(request: FastifyRequest) {
  if (request.cookies && request.cookies.token) {
    const token = request.cookies.token as string;

    const verificationStatus = verifyToken(token);
    if (verificationStatus) {
      request.user = {
        user_name: verificationStatus.user_name as string
      };
      return;
    }
  }

  throw new Error('Auth Failed');
}

export default authHandler;
