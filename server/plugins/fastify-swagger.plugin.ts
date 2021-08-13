import { FastifyInstance } from "fastify";

export function fastifySwaggerPlugin(server: FastifyInstance) {
    server.register(require('fastify-swagger'), {
        routePrefix: '/documentation',
        swagger: {
          info: {
            title: 'Nullcast V2 Api documentation',
            description: 'Testing the Fastify swagger API',
            version: '0.1.0',
            "x-logo" : {
              "url": "https://v2.nullcast.io/images/nullcast.svg",
              "backgroundColor": "#FFFFFF",
              "altText": "NullCast logo"
            }
          },
          externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
          },
          host: 'localhost',
          schemes: ['http'],
          consumes: ['application/json'],
          produces: ['application/json'],
          tags: [
            { name: 'user', description: 'NullCast user end-points' },
            { name: 'code', description: 'Code related end-points' }
          ],
          definitions: {
            User: {
              type: 'object',
              required: ['id', 'email'],
              properties: {
                id: { type: 'string', format: 'uuid' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: {type: 'string', format: 'email' }
              }
            }
          },
          securityDefinitions: {
            apiKey: {
              type: 'apiKey',
              name: 'apiKey',
              in: 'header'
            }
          }
        },
        uiConfig: {
          docExpansion: 'full',
          deepLinking: false
        },
        staticCSP: true,
        transformStaticCSP: (header: any) => header,
        exposeRoute: true
      });
}

export default fastifySwaggerPlugin;
