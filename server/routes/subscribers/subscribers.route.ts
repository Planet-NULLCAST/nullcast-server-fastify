import { RouteOptions } from "fastify";
import {FastifyInstance} from 'fastify/types/instance';

import * as controller from '../../controllers/index';

import { QueryParams } from "interfaces/query-params.type";
import { Subscriber } from "interfaces/subscriber";

import { addSubscriberSchema, deleteSubscriberSchema, getSubscribersSchema 
} from "route-schemas/subscibers/subscribers.schema";


const addSubscriber: RouteOptions = {
  method: 'POST',
  url: '/subscribe',
  schema: addSubscriberSchema,
  handler: async(request, reply) => {
    try {
      const data = await controller.addSubscriberController(request.body as Subscriber);
      if (data) {
        reply.code(201).send({message: 'User is now subscribed', data: data})
      } else{
        reply.code(500).send({message: 'User has not been subscribed'})
      }

    } catch (error: any) {
      if (error.detail.includes('email')) {
        throw ({ statusCode: 404, message:'User already subscribed' });
      } else {
        throw error;
      }
    }

  }
}

const getSubscribers: RouteOptions = {
  method: 'GET',
  url: '/subscribers',
  schema: getSubscribersSchema,
  handler: async(request, reply) => {
    try {
      const queryParams = JSON.parse(JSON.stringify(request.query)) as QueryParams;
      if (queryParams) {
        const data = await controller.getSubscribersController(queryParams);
        if(!data) {
          reply.code(404).send({message: "No data found"})
        }
        reply.code(200).send({ data: data });
      } else {
        reply.code(404).send({ message: 'Missing query constraints' });
      }
    } catch(error) {
      throw error;
    }
  }
}

const deleteSubscriber: RouteOptions = {
  method: 'DELETE',
  url: '/subscribe/:subscription_id',
  schema: deleteSubscriberSchema,
  handler: async(request, reply) => {
    const params = request.params as {subscription_id: number};

    if (await controller.deleteSubscriberController(params.subscription_id)) {
      reply.code(200).send({message: 'User unsubscribed'});
    } else {
      reply.code(500).send({message: 'User not unsubscibed'});
    }
  }
}

function initSubscribers(server:FastifyInstance, _:any, done: () => void) {
  server.route(addSubscriber);
  server.route(getSubscribers);
  server.route(deleteSubscriber);

  done();
}

export default initSubscribers;