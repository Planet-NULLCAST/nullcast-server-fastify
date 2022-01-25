import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

import * as controller from '../../controllers';

import { Post } from 'interfaces/post.type';
import { TokenUser } from 'interfaces/user.type';

import { adminReviewPostSchema, checkAdminSchema} from 'route-schemas/admin/admin.schema';


const checkAdmin: RouteOptions = {
  method: 'GET',
  url: '/admin/me',
  schema: checkAdminSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const userData = await controller.checkAdminController(user.id);
      if (userData) {
        reply.code(200).send({ message: 'User has admin access' });
      } else {
        reply.code(500).send({ message: 'User has no admin access' });
      }
    } catch (error) {
      throw error;
    }
  }
};

const adminReviewPost: RouteOptions = {
  method: 'PUT',
  url: '/admin/post/:post_id',
  schema: adminReviewPostSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const params = request.params as { post_id: number };
      const post = await controller.adminReviewPostController(request.body as Post, user.id, params.post_id);
      if (post) {
        reply.code(200).send({ message: 'Post updated'});
      } else {
        reply.code(500).send({ message: 'Something Error happend' });
      }
    } catch (error) {
      throw error;
    }
  }
};

function initAdminRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.route(checkAdmin);
  server.route(adminReviewPost);

  done();
}

export default initAdminRoutes;
