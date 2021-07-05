import { FastifyInstance } from 'fastify';
import { fastifyAuthPlugin } from './auth.plugin';
import fastifySwaggerPlugin from './fastify-swagger.plugin';

async function initPlugins(server: FastifyInstance) {

    fastifyAuthPlugin(server);
    fastifySwaggerPlugin(server);
}

export default initPlugins;