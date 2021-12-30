/* eslint-disable no-unused-vars */
import { RouteOptions } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

import * as controller from '../../controllers';
import {Event} from 'interfaces/event.type';
import { TokenUser } from 'interfaces/user.type';
import {
  createEventSchema, deleteEventSchema,
  getAllEventUrlSchema,
  getEventBySlugSchema, getEventsByUserIdSchema,
  getEventSchema, getEventsSchema, updateEventSchema
}
  from 'route-schemas/events/events.schema';
import { QueryParams } from 'interfaces/query-params.type';


const createEvent: RouteOptions = {
  method: 'POST',
  url: '/admin/event',
  schema: createEventSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const eventData = await controller.createEventController(request.body as Event, user.id);

      if (eventData) {
        reply.code(201).send({ message: 'Event created', data: eventData });
      } else {
        reply.code(500).send({ message: 'Something Error happend' });
      }

    } catch (error) {
      throw error;
    }

  }
};

const getEvent: RouteOptions = {
  method: 'GET',
  url: '/event/:eventId',
  schema: getEventSchema,
  handler: async(request, reply) => {
    try {
      const params = request.params as { eventId: number };

      const eventData = await controller.getEventController(params.eventId);

      if (!eventData) {
        reply.code(400).send({message: 'Event not Found'});
      }
      reply.code(200).send({ data: eventData });
    } catch (error) {
      throw error;
    }
  }
};

const getEventBySlug: RouteOptions = {
  method: 'GET',
  url: '/event-by-slug/:slug',
  schema: getEventBySlugSchema,
  handler: async(request, reply) => {
    try {
      const params = request.params as { slug: string };

      const eventData = await controller.getEventBySlugController(params.slug);

      if (!eventData) {
        reply.code(400).send({message: 'Event not Found'});
      }
      reply.code(200).send({ data: eventData });
    } catch (error) {
      throw error;
    }
  }
};

const getEvents: RouteOptions = {
  method: 'GET',
  url: '/events',
  schema: getEventsSchema,
  handler: async(request, reply) => {
    try {
      const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
      const eventData = await controller.getEventsController(queryParams);

      if (!eventData) {
        reply.code(200).send({message: 'Events not Found'});
      }
      reply.code(200).send({ data: eventData });
    } catch (error) {
      throw error;
    }
  }
};

const getAllEventUrl: RouteOptions = {
  method: 'GET',
  url: '/events-url',
  schema: getAllEventUrlSchema,
  handler: async(_request, reply) => {
    try {
      const events = await controller.getAllEventUrlController();
      reply.code(200).send({ data: events });
    } catch (error) {
      throw error;
    }
  }
};

const getEventsByUserId: RouteOptions = {
  method: 'GET',
  url: '/events/:userId',
  schema: getEventsByUserIdSchema,
  handler: async(request, reply) => {
    try {
      const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
      const params = request.params as { userId: number };
      const eventData = await controller.getEventsByUserIdController(queryParams, params.userId);

      if (!eventData) {
        reply.code(400).send({message: 'Events not Found'});
      }
      reply.code(200).send({ data: eventData });
    } catch (error) {
      throw error;
    }
  }
};

const updateEvent: RouteOptions = {
  method: 'PUT',
  url: '/admin/event/:eventId',
  schema: updateEventSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const params = request.params as { eventId: number };
      const eventData = await controller.updateEventController(request.body as Event, user.id, params.eventId);
      if (eventData) {
        reply.code(200).send({ message: 'Event updated', data: eventData});
      } else {
        reply.code(500).send({ message: 'Something Error happend' });
      }
    } catch (error) {
      throw error;
    }
  }
};

const deleteEvent: RouteOptions = {
  method: 'DELETE',
  url: '/admin/event/:eventId',
  schema: deleteEventSchema,
  handler: async(request, reply) => {
    const user = request.user as TokenUser;
    const params = request.params as { eventId: number };

    if (await controller.deleteEventController(params.eventId, user.id)) {
      reply.code(200).send({ message: 'Event deleted' });
    } else {
      reply.code(500).send({ message: 'Event not deleted' });
    }
  }
};
function initEvents(server: FastifyInstance, _: any, done: () => void) {
  server.route(createEvent);
  server.route(getEvent);
  server.route(getEventBySlug);
  server.route(getEvents);
  server.route(getAllEventUrl);
  server.route(getEventsByUserId);
  server.route(updateEvent);
  server.route(deleteEvent);

  done();
}

export default initEvents;
