import {FastifyInstance} from 'fastify';

import oembedRoutes from './embed/embed.route';
import initUsersRoutes from './users/users.route';
import docPath from './doc.route';
import mailerPath from './mailer.route';
import initTagsRoutes from './tags/tags.route';
import initTokensRoutes from './auth/auth.route';
import initPostsRoutes from './posts/posts.route';
import initCoursesRoutes from './courses/courses.route';
import initChaptersRoutes from './chapters/chapters.route';

function initRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.register(oembedRoutes);
  server.register(initUsersRoutes);
  server.register(initTagsRoutes);
  server.register(docPath);
  server.register(initTokensRoutes);
  server.register(initPostsRoutes);
  server.register(initCoursesRoutes);
  server.register(initChaptersRoutes);
  server.register(mailerPath);

  done();
}

export default initRoutes;
