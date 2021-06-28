import { RouteOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance";


function users (server:FastifyInstance) {
    const usersOptions: RouteOptions = {
        method: 'GET',
        url: '/users',
        handler: async (_, response) => {

            // The below DB operation will be moved to a controller logic
            const client = await server.pg.connect()
            const {rows} = await client.query(`SELECT * FROM users;`);
            client.release();
            response.send({data:rows}).code(200);
        }
    }

    server.route(usersOptions)
}


function initUsers(server:FastifyInstance) {
    users(server);
}

export default initUsers;