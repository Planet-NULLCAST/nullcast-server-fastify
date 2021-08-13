import {RouteOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance";
import * as fs from 'fs';
import * as path from 'path';
const stream = fs.createReadStream(path.resolve('./redoc.html'));

const documentation: RouteOptions = {
    method: 'GET',
    url: '/api/doc',
    handler: (_, rep) => {
        rep.type('text/html').send(stream);
    }
}

function docPath(server: FastifyInstance) {
    server.route(documentation);
}

export default docPath;