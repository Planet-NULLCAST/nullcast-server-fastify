/* eslint-disable no-unused-vars */
import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';
import * as controller from '../../controllers';
import {
  Post, DeletePost, SearchQuery
} from 'interfaces/post.type';
import {
  createPostSchema, getPostSchema, updatePostSchema, deletePostSchema
} from '../../route-schemas/post/post.schema';


const createPost: RouteOptions = {
  method: 'POST',
  url: '/post',
  schema: createPostSchema,
  handler: async(request, reply) => {
    try {
      const requestBody = {
        created_by: request.user?.id,
        ...request.body as Post
      };
      console.log(requestBody);
      const post = await controller.createPostController(requestBody as Post);

      if (post) {
        reply.code(201).send({ message: 'Post created' });
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
      const params = request.params as { postId: number };
      const postData = await controller.getPostController(params.postId);
      console.log(postData, '-------');
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
      if (await controller.updatePostController(request.body as Post)) {
        reply.code(200).send({ message: 'Post updated' });
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

const getPosts: RouteOptions = {
  method: 'GET',
  url: '/posts',
  handler: async(request, reply) => {
    const queryParams = request.query as SearchQuery;
    if (queryParams) {
      const posts = await controller.getPostsController(queryParams);
      reply.code(200).send({ posts });
    } else {
      reply.code(500).send({ message: 'some error' });
    }
  }
};

function initPosts(server: FastifyInstance, _: any, done: () => void) {
  server.route(createPost);
  server.route(getPost);
  server.route(updatePost);
  server.route(deletePost);
  server.route(getPosts);
  //getPostsbyuserid
  //getPublishedPostsCountByUserId
  //getPublishedPosts <-
  //getPostBySlug <-
  //changePostStatus <- PATCH
  //asc limit 10
  done();
}

export default initPosts;
