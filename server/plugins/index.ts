import { FastifyInstance } from "fastify";
import { fastifyPostgres } from "fastify-postgres";

function postgresPlugin(server: FastifyInstance) {
    server.register(fastifyPostgres,{
        connectionString: process.env.CONNECTIONSTRING 
    });
}

async function initPlugins(server: FastifyInstance) {

    postgresPlugin(server);
}

export default initPlugins;