import { RouteOptions } from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';
import * as controller from '../../controllers/index';
import { TokenUser } from 'interfaces/user.type';
import { Activity } from 'interfaces/activities.type';
import {
  createActivitySchema, deleteActivitySchema, getUserActivityPointsSchema, getUserYearlyActivitiesSchema
} from 'route-schemas/activities/activities.schema';


const createActivity: RouteOptions = {
  method: 'POST',
  url: '/activity',
  schema: createActivitySchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const activityData = await controller.createActivityController(request.body as Activity, user.id);
      if (activityData) {
        reply.code(201).send({message: 'Activity added', data: activityData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }

  }
};

const getUserYearlyActivities: RouteOptions = {
  method: 'GET',
  url: '/user-activities/:user_id',
  schema: getUserYearlyActivitiesSchema,
  handler: async(request, reply) => {
    try {
      const params = request.params as {user_id: number};
      const queryParams = request.query as {year: number};
      const activityData = await controller.getUserYearlyActivitiesController(queryParams, params.user_id);
      if (!activityData[0]) {
        reply.code(404).send({message: 'No activities found for this user'});
      }
      reply.code(200).send({message: 'Activities found', data: activityData});

    } catch (error) {
      throw error;
    }

  }
};

const getUserActivityPoints: RouteOptions = {
  method: 'GET',
  url: '/user-activity-points/:user_id',
  schema: getUserActivityPointsSchema,
  handler: async(request, reply) => {
    try {
      const params = request.params as {user_id: number};
      const activityData = await controller.getUserActivityPointsController(params.user_id);
      if (!activityData) {
        reply.code(404).send({message: 'No activity points found for this user'});
      }
      reply.code(200).send({message: 'User activity points successfully fetched', data: activityData});

    } catch (error) {
      throw error;
    }
  }
};

const deleteActivity: RouteOptions = {
  method: 'DELETE',
  url: '/activity/:activity_id',
  schema: deleteActivitySchema,
  handler: async(request, reply) => {
    const params = request.params as {activity_id: number};

    if (await controller.deleteActivityController(params.activity_id)) {
      reply.code(200).send({message: 'Activity deleted'});
    } else {
      reply.code(500).send({message: 'Activity not deleted'});
    }
  }
};

function initActivities(server:FastifyInstance, _:any, done: () => void) {
  server.route(createActivity);
  server.route(getUserYearlyActivities);
  server.route(getUserActivityPoints);
  server.route(deleteActivity);

  done();
}

export default initActivities;
