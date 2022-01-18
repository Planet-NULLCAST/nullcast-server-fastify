import {RouteOptions} from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';
import * as controller from '../../controllers/index';

import { TokenUser } from 'interfaces/user.type';
import { QueryParams } from 'interfaces/query-params.type';
import { EventRegister } from 'interfaces/event-register.type';
import {
  createEventRegistrationSchema, deleteEventAttendeeSchema,
  getEventAttendeesSchema
} from 'route-schemas/event-register/event-register.schema';


const createEventRegistration: RouteOptions = {
  method: 'POST',
  url: '/event-registration',
  schema: createEventRegistrationSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const eventRegisterData = await controller.createEventRegistrationController(request.body as EventRegister, user);
      if (eventRegisterData) {
        reply.code(201).send({message: 'User registered for the event successfully', data: eventRegisterData});
      } else {
        reply.code(500).send({message:'User registration failed'});
      }
    } catch (error) {
      throw error;
    }
  }
};

const getEventAttendees: RouteOptions = {
  method: 'GET',
  url: '/event-attendees/:event_id',
  schema: getEventAttendeesSchema,
  handler: async(request, reply) => {
    try {
      const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
      const params = request.params as {event_id: number};
      const eventRegisterData = await controller.getEventAttendeesController(params.event_id, queryParams);
      if (eventRegisterData) {
        reply.code(200).send({ data: eventRegisterData });
      } else {
        reply.code(404).send({ message: 'No users are registered for this event' });
      }
    } catch (error) {
      throw error;
    }
  }
};

const deleteEventAttendee: RouteOptions = {
  method: 'DELETE',
  url: '/event-registration/:event_id-:user_id',
  schema: deleteEventAttendeeSchema,
  handler: async(request, reply) => {
    const user = request.user as TokenUser;
    const params = request.params as {event_id: number};

    if (await controller.deleteEventAttendeeController(params.event_id, user.id)) {
      reply.code(200).send({message: 'User successfully deregistered from the event'});
    } else {
      reply.code(500).send({message: 'User not deregistered'});
    }
  }
};

function initEventRegister(server:FastifyInstance, _:any, done: () => void) {
  server.route(createEventRegistration);
  server.route(getEventAttendees);
  server.route(deleteEventAttendee);

  done();
}

export default initEventRegister;
