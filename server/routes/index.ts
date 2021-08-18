import {FastifyInstance} from 'fastify';

import oembedRoutes from './embed/embed.route';
import initUsersRoutes from './users/users.route';
import docPath from './doc.route';
import initTagsRoutes from './tags/tags.route';
import initTokensRoutes from './auth/auth.route';
import initPostsRoutes from './posts/posts.routes';

function initRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.register(oembedRoutes);
  server.register(initUsersRoutes);
  server.register(initTagsRoutes);
  server.register(docPath);
  server.register(initTokensRoutes);
  server.register(initPostsRoutes);


  done();
}

export default initRoutes;
