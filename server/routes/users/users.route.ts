import {RouteOptions} from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';
import * as controller from '../../controllers/index';

import  {
  createUserSchema, getUserSchema, updateUserSchema,
  deleteUserSchema, getUsersSchema, sendVerficationMailSchema,
  verifyUserEmailSchema, getAllUsernameSchema
}  from '../../route-schemas/users/users.schema';

import { User, UpdateUser } from 'interfaces/user.type';
import { QueryParams } from 'interfaces/query-params.type';
import { issueToken } from 'utils/jwt.utils';
import mailer from 'lib/mailer';
import { SendMailOptions } from 'nodemailer';


const createUser: RouteOptions = {
  method: 'POST',
  url: '/user',
  schema: createUserSchema,
  handler: async(request, reply) => {
    try {
      const userData = await controller.createUserController(request.body as User);
      if (userData.token) {
        reply.setCookie('token', userData.token,
          {signed: false, domain:'', path:'/', secure:true, httpOnly:true,
            maxAge: +(process.env.JWT_EXPIRY as string), sameSite:'none'});
        reply.code(201).send({message: 'User signed up successfully', user: userData.user, expiresIn: +(process.env.JWT_EXPIRY as string)});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error: any) {
      const keys = ['email', 'user_name'];
      keys.map((key: string) => {
        if (error.detail.includes(key)) {
          throw ({statusCode: 404, message: `${key == 'user_name' ? 'username' : key} already exists.`});
        }
      });
      throw error;
    }

  }
};

const getUser: RouteOptions = {
  method: 'GET',
  url: '/user/:user_name',
  schema: getUserSchema,
  handler: async(request, reply) => {
    const params = request.params as {user_name: string};
    const userData =  await controller.getUserController(params.user_name);
    if (userData) {
      reply.code(200).send({message: 'User Found', data: userData});
    }
    reply.code(400).send({message: 'User not Found'});

  }
};

const sendVerficationMail: RouteOptions = {
  method: 'POST',
  url: '/send-verification-mail',
  schema: sendVerficationMailSchema,
  handler: async(request, reply) => {
    try {
      const { to: userMail } = request.body as SendMailOptions;
      const resetToken = issueToken({email: userMail});
      const sender = await mailer.sendMail({
        from: 'Nullcast <connect@nullcast.io>',
        to: userMail,
        subject: 'Account verification',
        // eslint-disable-next-line max-len
        text: `Hi nullcast user, here is your account verification link: ${process.env.CLIENT_URL}/verify-user?token=${resetToken}`
      });

      if (sender) {
        reply.code(200).send({ message: `Verification link sent to ${userMail}` });
      } else {
        reply.code(500).send({ message: 'Some error occurred' });
      }
    } catch (error) {
      throw error;
    }
  }
};

const verifyUserEmail: RouteOptions = {
  method: 'PUT',
  url: '/verify-user',
  schema: verifyUserEmailSchema,
  handler: async(request, reply) => {
    const userData = await controller.verifyUserEmailController(request.body as { token: string });
    if (userData) {
      reply.code(200).send({ message: 'Email verified successfully' });
    }
    reply.code(400).send({ message: 'Email verification failed' });
  }
};

const updateUser: RouteOptions = {
  method: 'PUT',
  url: '/user/:userId',
  schema: updateUserSchema,
  handler: async(request, reply) => {
    try {
      const params = request.params as {userId: number};
      const user = await controller.updateUserController(request.body as UpdateUser, params.userId);
      if (user) {
        reply.code(200).send({message: 'User updated', data:user});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }
    } catch (error) {
      throw error;
    }
  }
};

const deleteUser: RouteOptions = {
  method: 'DELETE',
  url: '/user/:userId',
  schema: deleteUserSchema,
  handler: async(request, reply) => {
    const params = request.params as {userId: number};

    if (await controller.deleteUserController(params.userId)) {
      reply.code(200).send({message: 'User deleted'});
    } else {
      reply.code(500).send({message: 'User not deleted'});
    }
  }
};

const getUsers: RouteOptions = {
  method: 'GET',
  url: '/users',
  schema: getUsersSchema,
  handler: async(request, reply) => {
    const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
    if (queryParams) {
      const users = await controller.getUsersController(queryParams);
      reply.code(200).send({ data: users });
    } else {
      reply.code(500).send({ message: 'some error' });
    }
  }
};

const getAllUsername: RouteOptions = {
  method: 'GET',
  url: '/users-username',
  schema: getAllUsernameSchema,
  handler: async(_request, reply) => {
    try {
      const users = await controller.getAllUsernameController();
      reply.code(200).send({ data: users });
    } catch (error) {
      throw error;
    }
  }
};

function initUsers(server:FastifyInstance, _:any, done: () => void) {
  server.route(createUser);
  server.route(getUser);
  server.route(sendVerficationMail);
  server.route(verifyUserEmail);
  server.route(updateUser);
  server.route(deleteUser);
  server.route(getUsers);
  server.route(getAllUsername);

  done();
}

export default initUsers;
