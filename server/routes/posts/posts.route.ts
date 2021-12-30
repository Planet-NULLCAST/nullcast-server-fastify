/* eslint-disable no-unused-vars */
import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

import * as controller from '../../controllers';
import {Post} from 'interfaces/post.type';
import { QueryParams } from 'interfaces/query-params.type';
import { TokenUser } from 'interfaces/user.type';
import {
  createPostSchema, getPostSchema, updatePostSchema, 
  deletePostSchema, getPostsSchema, getPostBySlugSchema,
  getPostsByTagSchema, getPostsByUserIdSchema, 
  getPostsCountSchema, getAllPostUrlSchema
} from '../../route-schemas/post/post.schema';


const createPost: RouteOptions = {
  method: 'POST',
  url: '/post',
  schema: createPostSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const post = await controller.createPostController(request.body as Post, user.id);

      if (post) {
        reply.code(201).send({ message: 'Post created', data: post });
      } else {
        reply.code(500).send({ message: 'Something Error happend' });
      }

    } catch (error) {
      throw error;
    }

  }
};

const getPost: RouteOptions = {
  method: 'GET',
  url: '/post/:postId',
  schema: getPostSchema,
  handler: async(request, reply) => {
    try {
      const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
      const params = request.params as { postId: number };
      const user = request.user as TokenUser;

      const postData = await controller.getPostController(params.postId, queryParams, user);

      if (!postData) {
        reply.code(400).send({message: 'Post not Found'});
      }
      reply.code(200).send({ data: postData });
    } catch (error) {
      throw error;
    }
  }
};

const getPostBySlug: RouteOptions = {
  method: 'GET',
  url: '/post-by-slug/:slug',
  schema: getPostBySlugSchema,
  handler: async(request, reply) => {
    try {
      const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
      const params = request.params as { slug: string };
      const user = request.user as TokenUser;

      const postData = await controller.getPostBySlugController(params.slug, queryParams, user);

      if (!postData) {
        reply.code(400).send({message: 'Post not found'});
      }
      reply.code(200).send({ data: postData });
    } catch (error) {
      throw error;
    }
  }
};

const getPosts: RouteOptions = {
  method: 'GET',
  url: '/posts',
  schema: getPostsSchema,
  handler: async(request, reply) => {
    const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
    // const user = request.user as TokenUser;
    if (queryParams) {
      const posts = await controller.getPostsController(queryParams);
      reply.code(200).send({ data: posts });
    } else {
      reply.code(500).send({ message: 'some error' });
    }
  }
};

const getPostsByTag: RouteOptions = {
  method: 'GET',
  url: '/posts/:tagName',
  schema: getPostsByTagSchema,
  handler: async(request, reply) => {
    try {
      const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
      const params = request.params as { tagName: string };
      const user = request.user as TokenUser;

      const postData = await controller.getPostsByTagController(params.tagName, queryParams, user);

      if (!postData) {
        reply.code(400).send({message: 'Post not found'});
      }
      reply.code(200).send({ data: postData });
    } catch (error) {
      throw error;
    }
  }
};

const getPostsByUserId: RouteOptions = {
  method: 'GET',
  url: '/posts-by-user/:user_id',
  schema: getPostsByUserIdSchema,
  handler: async(request, reply) => {
    const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
    const params = request.params as { user_id: number };
    if (queryParams) {
      const posts = await controller.getPostsByUserIdController(queryParams, params.user_id as number);
      reply.code(200).send({ data: posts });
    } else {
      reply.code(500).send({ message: 'some error' });
    }
  }
};

const getPostsCount: RouteOptions = {
  method: 'GET',
  url: '/posts-count/:user_id',
  schema: getPostsCountSchema,
  handler: async(request, reply) => {
    const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
    const params = request.params as {user_id: number};
    if (queryParams) {
      const posts = await controller.getPostsCountController(queryParams, params.user_id);
      reply.code(200).send({message: 'Posts count', data: posts });
    } else {
      reply.code(500).send({ message: 'some error' });
    }
  }
};

const getAllPostUrl: RouteOptions = {
  method: 'GET',
  url: '/posts-url',
  schema: getAllPostUrlSchema,
  handler: async(_request, reply) => {
    try {
      const posts = await controller.getAllPostUrlController();
      reply.code(200).send({ data: posts });
    } catch (error) {
      throw error;
    }
  }
};

const updatePost: RouteOptions = {
  method: 'PUT',
  url: '/post/:postId',
  schema: updatePostSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const params = request.params as { postId: number };
      const post = await controller.updatePostController(request.body as Post, user.id, params.postId);
      if (post) {
        reply.code(200).send({ message: 'Post updated', data: post});
      } else {
        reply.code(500).send({ message: 'Something Error happend' });
      }
    } catch (error) {
      throw error;
    }
  }
};

const deletePost: RouteOptions = {
  method: 'DELETE',
  url: '/post/:postId',
  schema: deletePostSchema,
  handler: async(request, reply) => {
    const params = request.params as { postId: number };

    if (await controller.deletePostController(params.postId)) {
      reply.code(200).send({ message: 'Post deleted' });
    } else {
      reply.code(500).send({ message: 'Post not deleted' });
    }
  }
};

function initPosts(server: FastifyInstance, _: any, done: () => void) {
  server.route(createPost);
  server.route(getPost);
  server.route(getPostBySlug);
  server.route(getPosts);
  server.route(getPostsByTag);
  server.route(getPostsByUserId);
  server.route(getPostsCount);
  server.route(getAllPostUrl);
  server.route(updatePost);
  server.route(deletePost);
  //getPublishedPostsCountByUserId
  //getPublishedPosts <-
  //changePostStatus <- PATCH
  //asc limit 10
  done();
}

export default initPosts;
