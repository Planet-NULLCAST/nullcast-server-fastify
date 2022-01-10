import { RouteOptions } from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';
import * as controller from '../../controllers/index';
import { Class } from 'interfaces/classes.type';
import { deleteClassSchema } from 'route-schemas/classes/classes.schema';
import { createChapterSchema } from 'route-schemas/chapter/chapter.schema';


const createClass: RouteOptions = {
  method: 'POST',
  url: '/class',
  schema: createChapterSchema,
  handler: async(request, reply) => {
    try {
      const classData = await controller.createClassController(request.body as Class);
      if (classData) {
        reply.code(201).send({message: 'Class added', data: classData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }

  }
};

const deleteClass: RouteOptions = {
  method: 'DELETE',
  url: '/class/:class_name',
  schema: deleteClassSchema,
  handler: async(request, reply) => {
    const params = request.params as {class_name: string};

    if (await controller.deleteClassController(params.class_name)) {
      reply.code(200).send({message: 'Class deleted'});
    } else {
      reply.code(500).send({message: 'Class not deleted'});
    }
  }
};

function initClasses(server:FastifyInstance, _:any, done: () => void) {
  server.route(createClass);
  server.route(deleteClass);

  done();
}

export default initClasses;
