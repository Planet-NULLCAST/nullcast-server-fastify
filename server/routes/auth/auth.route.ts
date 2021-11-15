import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

import * as controller from '../../controllers/index';
import {
  ValidateUser, ValidateResetPassword, ValidateUpdatePassword
} from 'interfaces/user.type';
import {
  logoutSchema, signInSchema, resetPasswordSchema, updatePasswordSchema
} from '../../route-schemas/auth/auth.schema';

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
          { signed: false, domain: '', path: '/', secure: true, httpOnly: true, maxAge: +(process.env.JWT_EXPIRY as string), sameSite: 'none' });
        reply.code(200).send({expiresIn: +(process.env.JWT_EXPIRY as string)});
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
        { signed: false, domain: '', path: '/', secure: true, httpOnly: true, maxAge: +(process.env.JWT_EXPIRY as string), sameSite: 'none' });
      reply.code(200).send({ message: 'User logged in successfully', user: userData.user, expiresIn: +(process.env.JWT_EXPIRY as string)});
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

const resetPassword: RouteOptions = {
  method: 'POST',
  url: '/reset-password',
  schema: resetPasswordSchema,
  handler: async(request, reply) => {
    // within controller
    // token password will be recieved body
    // from token extract email getTokenData if failed return 400
    // hash password- first generate salt(hashUtility createRandomBytes), use createHash returns object
    // give hashed password and salt to service
    const userData = await controller.resetPasswordController(request.body as ValidateResetPassword);
    if (userData) {
      reply.code(200).send({ message: 'Password reset successfully' });
    }
    reply.code(400).send({ message: 'Reset Password failed' });
  }
};

const updatePassword: RouteOptions = {
  method: 'PUT',
  url: '/update-password',
  schema: updatePasswordSchema,
  handler: async(request, reply) => {
    const userData = await controller.updatePasswordController(request.body as ValidateUpdatePassword);
    if (userData) {
      reply.code(200).send({ message: 'Password updated successfully', data: userData });
    }
    reply.code(400).send({ message: 'Password updation failed' });
  }
};

function initTokensRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.route(getNewToken);
  server.route(signIn);
  server.route(logOut);
  server.route(resetPassword);
  server.route(updatePassword);

  done();
}

export default initTokensRoutes;
