import fastify from 'fastify';
import initServices from './initialize-services';
import initPlugins from './plugins';
// import initRoutes from './routes';
import initRoutes from './router';

async function start() {
    try {
        const server = fastify();

        //init plugins
        initPlugins(server);

        // services are decoupled from server. Hence their instances are stored in globalThis
        await initServices();

        //init the routes
        initRoutes(server);


        return server;

    } catch(error) {
        throw error;
    }
}

export default start;
