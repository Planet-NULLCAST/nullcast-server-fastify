import { FastifyInstance } from "fastify";
import fastifySwagger from 'fastify-swagger';

export function fastifySwaggerPlugin(server: FastifyInstance) {
    server.register(fastifySwagger, {
        routePrefix: '/documentation',
        swagger: {
            info: {
                title: 'Nullcast v2 documentation',
                description: 'API documentation for nullcast v2 server',
                version: '1.0.0'
            },
            host: process.env.HOST,
            schemes: ['http'],
            securityDefinitions: {
               basic: {
                   type: 'basic',
               }
            }
        }
    });
}

export default fastifySwaggerPlugin;
