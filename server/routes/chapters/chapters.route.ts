import { RouteOptions } from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';
import * as controller from '../../controllers/index';
import { Chapter, UpdateChapter } from 'interfaces/chapter.type';
import { TokenUser } from 'interfaces/user.type';
import {
  addChaptersSchema, createChapterSchema, deleteChapterSchema, getChapterSchema, updateChapterSchema
} from 'route-schemas/chapter/chapter.schema';


const createChapter: RouteOptions = {
  method: 'POST',
  url: '/chapter',
  schema: createChapterSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const chapterData = await controller.createChapterController(request.body as Chapter, user);
      if (chapterData) {
        reply.code(201).send({message: 'Chapter added', data: chapterData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }

  }
};

const addChapters: RouteOptions = {
  method: 'POST',
  url: '/chapters',
  schema: addChaptersSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const chapterData = await controller.addChaptersController(request.body as Chapter[], user);
      if (chapterData) {
        reply.code(201).send({message: 'Chapters added', data: chapterData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }

  }
};

const getChapter: RouteOptions = {
  method: 'GET',
  url: '/chapter/:chapter_name',
  schema: getChapterSchema,
  handler: async(request, reply) => {
    const params = request.params as {chapter_name: string};
    const courseData =  await controller.getChapterController(params.chapter_name);
    if (courseData) {
      reply.code(200).send({message: 'Chapter Found', data: courseData});
    }
    reply.code(400).send({message: 'Chapter not Found'});

  }
};

const updateChapter: RouteOptions = {
  method: 'PUT',
  url: '/chapter/:chapterId',
  schema: updateChapterSchema,
  handler: async(request, reply) => {
    try {
      const params = request.params as {chapterId: number};
      const user = request.user as TokenUser;
      const chapterData = await controller.updateChapterController(
        request.body as UpdateChapter,
        params.chapterId, user
      );
      if (chapterData) {
        reply.code(200).send({message: 'Chapter updated', data:chapterData});
      } else {
        reply.code(500).send({message:'Chapter not found'});
      }
    } catch (error) {
      throw error;
    }
  }
};

const deleteChapter: RouteOptions = {
  method: 'DELETE',
  url: '/chapter/:chapterId',
  schema: deleteChapterSchema,
  handler: async(request, reply) => {
    const params = request.params as {chapterId: number};

    if (await controller.deleteChapterController(params.chapterId)) {
      reply.code(200).send({message: 'Chapter deleted'});
    } else {
      reply.code(500).send({message: 'Chapter not deleted'});
    }
  }
};

function initChapters(server:FastifyInstance, _:any, done: () => void) {
  server.route(createChapter);
  server.route(addChapters);
  server.route(getChapter);
  server.route(updateChapter);
  server.route(deleteChapter);

  done();
}

export default initChapters;
