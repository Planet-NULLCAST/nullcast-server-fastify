import {RouteOptions} from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';

import * as controller from '../../controllers/index';

import { TokenUser } from 'interfaces/user.type';
import { PostVote } from 'interfaces/post-vote.type';
import {
  addPostVoteSchema, deletePostVoteSchema,
  getPostVoteByUserSchema, getPostVotesSchema
} from 'route-schemas/post-votes/post-votes.schema';


const addPostVote: RouteOptions = {
  method: 'POST',
  url: '/post-vote/:post_id',
  schema: addPostVoteSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const params = request.params as {post_id: number};
      const postVoteData = await controller.addPostVoteController(request.body as PostVote, params.post_id,  user);
      if (postVoteData) {
        reply.code(201).send({message: 'Voted for the post', data: postVoteData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }
  }
};

const getPostVotes: RouteOptions = {
  method: 'GET',
  url: '/post-votes/:post_id',
  schema: getPostVotesSchema,
  handler: async(request, reply) => {
    try {
      const params = request.params as {post_id: number};
      const postVoteData = await controller.getPostVoteController(params.post_id);

      if (!postVoteData) {
        reply.code(400).send({message: 'No votes found for this post'});
      }
      reply.code(200).send({ data: postVoteData });
    } catch (error) {
      throw error;
    }
  }
};

const getPostVoteByUser: RouteOptions = {
  method: 'GET',
  url: '/post-vote-by-user/:post_id',
  schema: getPostVoteByUserSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const params = request.params as {post_id: number};
      const postVoteData = await controller.getPostVoteByUserController(params.post_id, user);

      if (!postVoteData) {
        reply.code(400).send({message: 'User has not voted for this post'});
      }
      reply.code(200).send({ message: 'User response for this post has been fetched', data: postVoteData });
    } catch (error) {
      throw error;
    }
  }
};

const deletePostVote: RouteOptions = {
  method: 'DELETE',
  url: '/post-vote/:post_id',
  schema: deletePostVoteSchema,
  handler: async(request, reply) => {
    const user = request.user as TokenUser;
    const params = request.params as {post_id: number};
    if (await controller.deletePostVoteController(params.post_id, user.id)) {
      reply.code(200).send({message: 'Post vote deleted'});
    } else {
      reply.code(500).send({message: 'Post vote not deleted'});
    }
  }
};


function initPostVotes(server:FastifyInstance, _:any, done: () => void) {
  server.route(addPostVote);
  server.route(getPostVotes);
  server.route(getPostVoteByUser);
  server.route(deletePostVote);

  done();
}

export default initPostVotes;
