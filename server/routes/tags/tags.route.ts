import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';
import { UserData } from 'interfaces/auth-token.type';
import { QueryParams } from 'interfaces/query-params.type';
import { Tag } from 'interfaces/tags.type';
import {
  createTagSchema, getTagSchema, getTagsSchema, updateTagSchema
} from 'route-schemas/tags/tags.schema';
import * as controller from '../../controllers';

const createTag: RouteOptions = {
  method: 'POST',
  url: '/tag',
  schema: createTagSchema,
  handler: async(request, reply) => {
    try {
      const tag = await controller.createTagController(request.body as Tag, request.user as UserData);
      reply.code(201).send(tag);
    } catch (error) {
      if (error.statusCode) {
        reply.code(error.statusCode).send(error);
      } else {
        throw error;
      }
    }

  }
};

const getTag: RouteOptions = {
  method: 'GET',
  url: '/tag/:tag_name',
  schema: getTagSchema,
  handler: async(request, reply) => {
    try {
      const params = request.params as { tag_name: string };
      const tagData = await controller.getTagController(params.tag_name);
      reply.code(200).send(tagData);
    } catch (error) {
      if (error.statusCode) {
        reply.code(error.statusCode).send(error);
      } else {
        throw error;
      }
    }
  }
};

const getTags: RouteOptions = {
  method: 'GET',
  url: '/tags',
  schema: getTagsSchema,
  handler: async(request, reply) => {
    try {
      const results = await controller.getTagsController(request.query as QueryParams);
      return reply.code(200).send(results);
    } catch (error) {
      if (error.statusCode) {
        return reply.code(error.statusCode).send(error);
      }
      throw error;
    }

  }
};

const updateTag: RouteOptions = {
  method: 'PUT',
  url: '/tag/:tag_name',
  schema: updateTagSchema,
  handler: async(request, reply) => {
    try {
      const params = request.params as { tag_name: string };
      // eslint-disable-next-line max-len
      const tagData = await controller.updateTagController(params.tag_name, request.body as Tag, request.user as UserData);
      reply.code(200).send(tagData);
    } catch (error) {
      throw error;
    }
  }
};

// const deleteTag: RouteOptions = {
//   method: 'DELETE',
//   url: '/tag/tag_id',
//   handler: async(request, reply) => {
//     try {
//       const params = request.params as { tag_id: number };
//       await controller.deleteTagController(params.tag_id);
//       reply.code(200).send();
//     } catch (error) {
//       throw error;
//     }
//   }
// };

function initTagsRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.route(createTag);
  server.route(getTag);
  server.route(updateTag);
  server.route(getTags);

  done();
}

export default initTagsRoutes;
