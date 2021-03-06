import {FastifyInstance} from 'fastify';

import {fastifyAuthPlugin} from './auth.plugin';
import {fastifyCookiePlugin} from './cookie.plugin';
import {fastifyCorsPlugin} from './cors.plugin';
import fastifySwaggerPlugin from './fastify-swagger.plugin';

async function initPlugins(server: FastifyInstance) {

  fastifyAuthPlugin(server);
  fastifySwaggerPlugin(server);
  fastifyCookiePlugin(server);
  fastifyCorsPlugin(server);
}

export default initPlugins;
