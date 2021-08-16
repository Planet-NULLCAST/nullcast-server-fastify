import {RouteOptions} from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';

const getOmbed: RouteOptions = {
  method: 'GET',
  url: '/oembed',
  handler: (_, response) => {
    response.send({ message: 'All Okay yay!!!' }).code(200);
  }
};

const getOmbed1: RouteOptions = {
  method: 'GET',
  url: '/oembed1',
  handler: (_, response) => {
    response.send({ message: 'All Okay yay!!!1' }).code(200);
  }
};


function oembedRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.route(getOmbed);
  server.route(getOmbed1);

  done();
}

export default oembedRoutes;
