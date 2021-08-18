import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';
import { Tag } from 'interfaces/tags.type';
import controller from '../../controllers/index';

const createTag: RouteOptions = {
  method: 'POST',
  url: '/tag',
  handler: async(request, reply) => {
    try {
      await controller.createTagController(request.body as Tag);
      reply.code(201).send();
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
  handler: async(request, reply) => {
    try {
      const params = request.params as {tag_name: string};
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

const updateTag: RouteOptions = {
  method: 'PUT',
  url: '/tag/:tag_name',
  handler: async(request, reply) => {
    try {
      const params = request.params as {tag_name: string};
      await controller.updateTagController(params.tag_name, request.body as Tag);
      reply.code(200).send();
    } catch (error) {
      throw error;
    }
  }
};

function initTags(server: FastifyInstance, _: any, done: () => void) {
  server.route(createTag);
  server.route(getTag);
  server.route(updateTag);

  done();
}

export default initTags;
