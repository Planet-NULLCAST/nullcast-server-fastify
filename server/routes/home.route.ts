import {RouteOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance";

import { homeSchema, healthSchema } from '../route-schemas/home/home.schema';

const getHome: RouteOptions = {
    method: 'GET',
    url: '/',
    schema: homeSchema,
    handler:  (_, response) => {
        response.send({message: 'All Okay yay!!!'}).code(200);
    }
}

const getHealthCheck: RouteOptions = {
    method: 'GET',
    url: '/health-check',
    schema: healthSchema,
    handler:  (_, response) => {
        response.send({message: 'Check your server and DB status on this endpoint'}).code(200);
    }
}

function homePath(server: FastifyInstance) {

    server.route(getHome);
    server.route(getHealthCheck);

}

export default homePath;