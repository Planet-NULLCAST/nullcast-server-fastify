import {RouteOptions} from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';

import * as controller from '../../controllers/index';

import { QueryParams } from 'interfaces/query-params.type';
import { 
    createPostTagSchema, deletePostTagSchema, 
    getPostsByTagIdSchema, gettagsByPostIdSchema 
} from 'route-schemas/post-tags/post-tags.schema';
import { TokenUser } from 'interfaces/user.type';
import { PostTag } from 'interfaces/post-tag.type';


const createPostTag: RouteOptions = {
  method: 'POST',
  url: '/post-tag',
  schema: createPostTagSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const postTagData = await controller.createPostTagController(request.body as PostTag, user);
      if (postTagData) {
        reply.code(201).send({message: 'Added tag for post', data: postTagData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }

  }
};

const getPostsByTagId: RouteOptions = {
  method: 'GET',
  url: '/posts-by-tag-id/:tag_id',
  schema: getPostsByTagIdSchema,
  handler: async(request, reply) => {
    try {
      const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
      const params = request.params as { tag_id: number };
      const postData = await controller.getPostsByTagIdController(queryParams, params.tag_id);

      if (!postData) {
        reply.code(400).send({message: 'No posts found with this tag'});
      }
      reply.code(200).send({ data: postData });
    } catch (error) {
      throw error;
    }
  }
};

const getTagsByPostId: RouteOptions = {
    method: 'GET',
    url: '/post-tags/:post_id',
    schema: gettagsByPostIdSchema,
    handler: async(request, reply) => {
      try {
        const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
        const params = request.params as { post_id: number };
        const tagData = await controller.getTagsByPostIdController(queryParams, params.post_id);
  
        if (!tagData) {
          reply.code(400).send({message: 'No tags found for this post'});
        }
        reply.code(200).send({ data: tagData });
      } catch (error) {
        throw error;
      }
    }
  };

const deletePostTag: RouteOptions = {
  method: 'DELETE',
  url: '/post-tag/:tag_id-:post_id',
  schema: deletePostTagSchema,
  handler: async(request, reply) => {
    const params = request.params as {tag_id: number, post_id: number};
    if (await controller.deletePostTagController(params.tag_id, params.post_id)) {
      reply.code(200).send({message: 'Post Tag deleted'});
    } else {
      reply.code(500).send({message: 'Post Tag not deleted'});
    }
  }
};


function initPostTags(server:FastifyInstance, _:any, done: () => void) {
  server.route(createPostTag);
  server.route(getPostsByTagId);
  server.route(getTagsByPostId);
  server.route(deletePostTag);

  done();
}

export default initPostTags;