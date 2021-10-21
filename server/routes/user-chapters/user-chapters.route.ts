import {RouteOptions} from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';

import * as controller from '../../controllers/index';
import { TokenUser } from 'interfaces/user.type';
import {
  UpdateUserChapter, UserChapter, UserChapterProgress
} from 'interfaces/user-chapter.type';
import {
  createUserChapterSchema, deleteUserChapterSchema, getUserChapterProgressSchema,
  getUserChapterSchema, updateUserChapterSchema
} from 'route-schemas/user-chapters/user-chapters.schema';


const createUserChapter: RouteOptions = {
  method: 'POST',
  url: '/user-chapter',
  schema: createUserChapterSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const userChapterData = await controller.createUserChapterController(
        request.body as UserChapter, user);
      if (userChapterData) {
        reply.code(201).send({message: 'User Chapter created', data: userChapterData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }

  }
};

const getUserChapter: RouteOptions = {
  method: 'GET',
  url: '/user-chapter/:user_chapter_id',
  schema: getUserChapterSchema,
  handler: async(request, reply) => {
    const params = request.params as {user_chapter_id: number};
    const userChapterData =  await controller.getUserChapterController(params.user_chapter_id);
    if (userChapterData) {
      reply.code(200).send({message: 'User Chapter Found', data: userChapterData});
    }
    reply.code(400).send({message: 'USer CHapter not Found'});

  }
};

const getUserChapterProgress: RouteOptions = {
  method: 'GET',
  url: '/user-chapter/progress',
  schema: getUserChapterProgressSchema,
  handler: async(request, reply) => {
    const userChapterData =  await controller.getUserChapterProgressController(
      request.query as UserChapterProgress);
    if (userChapterData) {
      reply.code(200).send({message: 'User progress found', count: userChapterData});
    }
    reply.code(400).send({message: 'User progress not found'});

  }
};

const updateUserChapter: RouteOptions = {
  method: 'PUT',
  url: '/user-chapter/:user_chapter_id',
  schema: updateUserChapterSchema,
  handler: async(request, reply) => {
    try {
      const params = request.params as {user_chapter_id: number};
      const user = request.user as TokenUser;
      const userChapterData = await controller.updateUserChapterController(
        request.body as UpdateUserChapter, params.user_chapter_id, user);
      if (userChapterData) {
        reply.code(200).send({message: 'User Chapter updated', data:userChapterData});
      } else {
        reply.code(500).send({message:'User Chapter not found'});
      }
    } catch (error) {
      throw error;
    }
  }
};

const deleteUserChapter: RouteOptions = {
  method: 'DELETE',
  url: '/user-chapter/:user_chapter_id',
  schema: deleteUserChapterSchema,
  handler: async(request, reply) => {
    const params = request.params as {user_chapter_id: number};

    if (await controller.deleteUserChapterController(params.user_chapter_id)) {
      reply.code(200).send({message: 'User Chapter deleted'});
    } else {
      reply.code(500).send({message: 'User Chapter not deleted'});
    }
  }
};


function initUserChapters(server:FastifyInstance, _:any, done: () => void) {
  server.route(createUserChapter);
  server.route(getUserChapter);
  server.route(getUserChapterProgress);
  server.route(updateUserChapter);
  server.route(deleteUserChapter);

  done();
}

export default initUserChapters;
