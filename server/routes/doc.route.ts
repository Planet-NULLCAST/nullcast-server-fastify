import {RouteOptions} from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';

import {docSchema} from 'route-schemas/home/home.schema';

import * as fs from 'fs';
import * as path from 'path';
const stream = fs.createReadStream(path.resolve('./redoc.html'));

const documentation: RouteOptions = {
  method: 'GET',
  url: '/doc',
  schema: docSchema,
  handler: (_, rep) => {
    rep.type('text/html').send(stream);
  }
};

function docPath(server: FastifyInstance, _: any, done: () => void) {
  server.route(documentation);

  done();
}

export default docPath;
