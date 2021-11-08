import {FastifyInstance} from 'fastify';

export function fastifySwaggerPlugin(server: FastifyInstance) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  server.register(require('fastify-swagger'), {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Nullcast Server Api',
        description: 'New Fastify Server for Nullcast Version 2 with Postgres as Database.',
        version: '0.1.0',
        termsOfService:'http://swagger.io/terms/',
        'x-logo': {
          'url': 'https://v2.nullcast.io/images/nullcast.svg',
          'backgroundColor': '#FFFFFF',
          'altText': 'Nullcast logo'
        },
        contact:{
          email:'apiteam@swagger.io'
        },
        license:{
          name:'Apache 2.0',
          url:'http://www.apache.org/licenses/LICENSE-2.0.html'
        }
      },
      'tags': [
        {
          'name': 'Introduction',
          'description': 'fastify server Api consisting of create, get, update and delete requests.'
        },
        {
          'name': 'Authentication',
          'description': 'Preliminary backend authentication apis'
        }
      ],
      externalDocs: {
        url: 'https://github.com/Planet-NULLCAST/nullcast-server-fastify/tree/feature/adding-routes-types#readme',
        description: 'Find more on Planet-Nullcast repo here'
      },
      // eslint-disable-next-line no-constant-condition
      host: `${process.env.HOST = 'development' ?
        `${process.env.HOST}:${process.env.PORT}` : `${process.env.HOST}`}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    },
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    staticCSP: true,
    transformStaticCSP: (header:any) => header,
    exposeRoute: true
  });
}

export default fastifySwaggerPlugin;
