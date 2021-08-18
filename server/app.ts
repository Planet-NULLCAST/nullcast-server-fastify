import fastify from 'fastify';
import initServices from './initialize-services';
import initPlugins from './plugins';
import initRoutes from './routes';

async function start() {
  try {
    const server = fastify();

    // setting a request decorator to store toekn decoded data. It is efficient to decalre a decorator first.
    // refer: https://www.fastify.io/docs/master/Decorators/
    server.decorateRequest('authData', null);


    //init plugins
    initPlugins(server);

    const PREFIX = '/api/v1';

    server.register(initRoutes, {prefix: PREFIX});

    // services are decoupled from server. Hence their instances are stored in globalThis
    await initServices();

    return server;

  } catch (error) {
    throw error;
  }
}

export default start;
