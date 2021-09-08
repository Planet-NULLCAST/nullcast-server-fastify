/* eslint-disable no-unused-vars */
import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';
import * as controller from '../../controllers';
import {Post, DeletePost} from 'interfaces/post.type';
import {
  createPostSchema, getPostSchema, updatePostSchema, deletePostSchema, getPostsSchema, getPostBySlugSchema
} from '../../route-schemas/post/post.schema';
import { QueryParams } from 'interfaces/query-params.type';
import { TokenUser } from 'interfaces/user.type';


const createPost: RouteOptions = {
  method: 'POST',
  url: '/post',
  schema: createPostSchema,
  handler: async(request, reply) => {
    try {
      (request.body as Post).created_by = request.user?.id;
      const post = await controller.createPostController(request.body as Post);

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
        reply.code(400).send({data: 'sdsds'});
      }
      reply.code(200).send({ data: postData });
    } catch (error) {
      throw error;
    }
  }
};

const getPostBySlug: RouteOptions = {
  method: 'GET',
  url: '/post-slug/:slug',
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

const getPostsByTag: RouteOptions = {
  method: 'GET',
  url: '/posts/:tagName',
  schema: getPostsSchema,
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

const updatePost: RouteOptions = {
  method: 'PUT',
  url: '/post',
  schema: updatePostSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const post = await controller.updatePostController(request.body as Post, user.id);
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
  url: '/post',
  schema: deletePostSchema,
  handler: async(request, reply) => {
    const requestBody = request.body as DeletePost;

    if (await controller.deletePostController(requestBody)) {
      reply.code(200).send({ message: 'Post deleted' });
    } else {
      reply.code(500).send({ message: 'Post not deleted' });
    }
  }
};

function initPosts(server: FastifyInstance, _: any, done: () => void) {
  server.route(createPost);
  server.route(getPost);
  server.route(updatePost);
  server.route(deletePost);
  server.route(getPosts);
  server.route(getPostBySlug);
  server.route(getPostsByTag);
  //getPostsbyuserid
  //getPublishedPostsCountByUserId
  //getPublishedPosts <-
  //changePostStatus <- PATCH
  //asc limit 10
  done();
}

export default initPosts;
