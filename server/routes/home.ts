import {RouteOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance";


function home(server: FastifyInstance) {

    const homeOptions: RouteOptions = {
        method: 'GET',
        url: '/',
        handler:  (_, response) => {
            response.send({message: 'All Okay yay!!!'}).code(200);
        }
    }
    server.route(homeOptions);
}

function healthCheck(server: FastifyInstance) {
    const healthCheckOptions: RouteOptions = {
        method: 'GET',
        url: '/health-check',
        handler:  (_, response) => {
            response.send({message: 'Check your server and DB status on this endpoint'}).code(200);
        }
    }
    server.route(healthCheckOptions);
}

function homePath(server: FastifyInstance) {

    home(server);
    healthCheck(server);

}

export default homePath;