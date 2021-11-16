import {RouteOptions} from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';

import * as controller from '../../controllers/index';

import { TokenUser } from 'interfaces/user.type';
import { UpdateUserTag, UserTag } from 'interfaces/user-tag.type';
import { QueryParams } from 'interfaces/query-params.type';
import {
  createUserTagSchema, createUserTagsSchema, deleteUserTagSchema,
  deleteUserTagsSchema, getUserTagsSchema, updateUserTagSchema
} from 'route-schemas/user-tags/user-tags.schema';


const createUserTag: RouteOptions = {
  method: 'POST',
  url: '/user-tag',
  schema: createUserTagSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const userTagData = await controller.createUserTagController(request.body as UserTag, user);
      if (userTagData) {
        reply.code(201).send({message: 'Added tag for user', data: userTagData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }

  }
};

const createUserTags: RouteOptions = {
  method: 'POST',
  url: '/user-tags',
  schema: createUserTagsSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const userTagData = await controller.createUserTagsController(request.body as UserTag[], user);
      if (userTagData[0]) {
        reply.code(201).send({message: 'Added all user skills', data: userTagData});
      } else {
        reply.code(404).send({statusCode: 404, message:'No skills are added for the user'});
      }
    } catch (error: any) {
      const regExp = error.detail.match(/(\d+)/i)[1];
      if (error.detail.includes('tag_id')) {
        throw ({statusCode: 404, message: `Skill with id = ${regExp} doesn't exists`});
      } else {
        throw error;
      }
    }

  }
};

const getUserTagsByUserId: RouteOptions = {
  method: 'GET',
  url: '/user-tags/:user_id',
  schema: getUserTagsSchema,
  handler: async(request, reply) => {
    try {
      const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
      const params = request.params as { user_id: number };
      const userTagData = await controller.getUserTagsByUserIdController(queryParams, params.user_id);

      if (!userTagData) {
        reply.code(400).send({message: 'No tags found for the user'});
      }
      reply.code(200).send({ data: userTagData });
    } catch (error) {
      throw error;
    }
  }
};

const updateUserTag: RouteOptions = {
  method: 'PUT',
  url: '/user-tag/:tag_id',
  schema: updateUserTagSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const params = request.params as {tag_id: number};
      const userTagData = await controller.updateUserTagController(
        request.body as UpdateUserTag, params.tag_id, user);
      if (userTagData) {
        reply.code(200).send({message: 'User Tag updated', data:userTagData});
      } else {
        reply.code(500).send({message:'User Tag not found'});
      }
    } catch (error) {
      throw error;
    }
  }
};

const deleteUserTag: RouteOptions = {
  method: 'DELETE',
  url: '/user-tag/:tag_id',
  schema: deleteUserTagSchema,
  handler: async(request, reply) => {
    const user = request.user as TokenUser;
    const params = request.params as {tag_id: number};
    if (await controller.deleteUserTagController(params.tag_id, user.id)) {
      reply.code(200).send({message: 'User Tag deleted'});
    } else {
      reply.code(500).send({message: 'User Tag not deleted'});
    }
  }
};

const deleteUserTags: RouteOptions = {
  method: 'DELETE',
  url: '/user-tags',
  schema: deleteUserTagsSchema,
  handler: async(request, reply) => {
    const user = request.user as TokenUser;
    if (await controller.deleteUserTagsController(user.id)) {
      reply.code(200).send({message: 'Skills associated with this user has been successfully deleted'});
    } else {
      reply.code(500).send({message: 'Skills not deleted successfully for this user'});
    }
  }
};


function initUserTags(server:FastifyInstance, _:any, done: () => void) {
  server.route(createUserTag);
  server.route(createUserTags);
  server.route(getUserTagsByUserId);
  server.route(updateUserTag);
  server.route(deleteUserTag);
  server.route(deleteUserTags);

  done();
}

export default initUserTags;
