import {FastifyInstance} from 'fastify';
import oembedRoutes from './embed.route';
import initUsersRoutes from './users/users.route';
import docPath from './doc.route';
import initTags from './tags/tags.route';
import initTokens from './tokens/tokens.route';

function initRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.register(oembedRoutes);
  server.register(initUsersRoutes);
  server.register(initTags);
  server.register(docPath);
  server.register(initTokens);

  done();
}

export default initRoutes;
