import { RouteOptions } from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';
import * as controller from '../../controllers/index';
import { TokenUser } from 'interfaces/user.type';
import { ActivityType } from 'interfaces/activity-types.type';
import { 
  createActivityTypeSchema, deleteActivityTypeSchema 
} from 'route-schemas/activity-types/activity-types.schema';


const createActivityType: RouteOptions = {
  method: 'POST',
  url: '/activity-type',
  schema: createActivityTypeSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const activityTypeData = await controller.createActivityTypeController(request.body as ActivityType, user.id);
      if (activityTypeData) {
        reply.code(201).send({message: 'Activity type added', data: activityTypeData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }

  }
};

const deleteActivityType: RouteOptions = {
  method: 'DELETE',
  url: '/activity-type/:activity_type_id',
  schema: deleteActivityTypeSchema,
  handler: async(request, reply) => {
    const params = request.params as {activity_type_id: number};

    if (await controller.deleteActivityTypeController(params.activity_type_id)) {
      reply.code(200).send({message: 'Activity type deleted'});
    } else {
      reply.code(500).send({message: 'Activity type not deleted'});
    }
  }
};

function initActivityTypes(server:FastifyInstance, _:any, done: () => void) {
  server.route(createActivityType);
  server.route(deleteActivityType);

  done();
}

export default initActivityTypes;
