import { FastifyInstance, RouteOptions } from 'fastify';
import * as controller from '../../controllers';
import { TokenUser } from 'interfaces/user.type';
import { Follow } from 'interfaces/followers.type';
import { QueryParams } from 'interfaces/query-params.type';
import { addFollowerSchema, getFollwersSchema, removeFollwerSchema } from 'route-schemas/followers/followers.schema';


const addFollower: RouteOptions = {
  method: 'POST',
  url: '/follow',
  schema: addFollowerSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const followerData = await controller.addFollowerController(request.body as Follow, user.id);

      if (followerData) {
        reply.code(201).send({ message: 'Successfully folowing', data: followerData });
      } else {
        reply.code(500).send({ message: 'Something Error happend' });
      }

    } catch (error: any) {
      if (error.constraint.includes('followers_pkey')) {
        throw ({statusCode: 403, message: `You are already following this user`});
      }
      throw error;
    }

  }
};

const getFollowers: RouteOptions = {
  method: 'GET',
  url: '/followers/:following_id',
  schema: getFollwersSchema,
  handler: async(request, reply) => {
    try {
      const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
      const params = request.params as { following_id: number };
      const followerData = await controller.getFollowersController(
        params.following_id, queryParams as QueryParams);

      if (!followerData) {
        reply.code(404).send({ message: 'No followers found for this user' });
      }
      reply.code(200).send({data: followerData });

    } catch (error) {
      throw error;
    }

  }
};

const removeFollower: RouteOptions = {
  method: 'DELETE',
  url: '/follow/:following_id',
  schema: removeFollwerSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const params = request.params as { following_id: number };

      if (await controller.removeFollowerController(params.following_id, user.id)) {
        reply.code(200).send({message: 'Successfully unfollowed the user'});
      } else {
        reply.code(500).send({message: 'User not unfollowed'});
      }
    } catch (error: any) {
      throw error;
    }
  }
};


function initFollowers(server: FastifyInstance, _: any, done: () => void) {
  server.route(addFollower);
  server.route(getFollowers);
  server.route(removeFollower);

  done();
}

export default initFollowers;
