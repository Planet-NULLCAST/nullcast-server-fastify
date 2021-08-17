import {RouteOptions} from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';
import * as embedController from '../../controllers/embed/embed.controller';
import * as embedSchema from '../../route-schemas/embed/embed.schema';

const getOmbed: RouteOptions = {
  method: 'GET',
  url: '/embed',
  schema: embedSchema.getEmbedSchema,
  handler: async(request, reply) => {
    const queryParams = request.query as {url: string, type: string};
    const embedData =  await embedController.getOmbed(queryParams.url);

    reply.code(200).send({data: embedData});
  }
};

function oembedRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.route(getOmbed);

  done();
}

export default oembedRoutes;
