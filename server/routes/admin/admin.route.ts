import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

import * as controller from '../../controllers';

import { Post } from 'interfaces/post.type';
import { TokenUser } from 'interfaces/user.type';
import { Event } from 'interfaces/event.type';

import {
  createAdminEventSchema, adminReviewPostSchema,
  checkAdminSchema, adminReviewEventSchema
} from 'route-schemas/admin/admin.schema';


const AdminCreateEvent: RouteOptions = {
  method: 'POST',
  url: '/admin/event',
  schema: createAdminEventSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const eventData = await controller.AdminCreateEventController(request.body as Event, user.id);

      if (eventData) {
        reply.code(201).send({ message: 'Event created', data: eventData });
      } else {
        reply.code(500).send({ message: 'Something Error happend' });
      }
    } catch (error: any) {
      if (error?.detail?.includes('slug') || error?.detail?.includes('title')) {
        throw ({statusCode: 404, message: 'Event title already exists'});
      }
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

const adminReviewEvent: RouteOptions = {
  method: 'PUT',
  url: '/admin/event/:eventId',
  schema: adminReviewEventSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const params = request.params as { eventId: number };
      const eventData = await controller.adminReviewEventController(request.body as Event, user.id, params.eventId);
      if (eventData) {
        reply.code(200).send({ message: 'Event updated', data: eventData});
      } else {
        reply.code(500).send({ message: 'Something Error happend' });
      }
    } catch (error) {
      throw error;
    }
  }
};

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

function initAdminRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.route(AdminCreateEvent);
  server.route(adminReviewPost);
  server.route(adminReviewEvent);
  server.route(checkAdmin);

  done();
}

export default initAdminRoutes;
