import fastify from 'fastify';
import initPlugins from './plugins';
import initRoutes from './routes';

async function start() {
    try {
        const server = fastify();

        //init plugins
        initPlugins(server);
        //init the routes
        initRoutes(server);

        return server;

    } catch(error) {
        throw error;
    }
}

export default start;
