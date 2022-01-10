import {FastifyInstance} from 'fastify';

import oembedRoutes from './embed/embed.route';
import initAdminRoutes from './admin/admin.route';
import initUsersRoutes from './users/users.route';
import docPath from './doc.route';
import mailerPath from './mailer.route';
import initTagsRoutes from './tags/tags.route';
import initTokensRoutes from './auth/auth.route';
import initPostsRoutes from './posts/posts.route';
import initCoursesRoutes from './courses/courses.route';
import initChaptersRoutes from './chapters/chapters.route';
import initUserCourses from './user-courses/user-courses.route';
import initUserChapters from './user-chapters/user-chapters.route';
import initEvents from './events/events.route';
import initPostTags from './post-tags/post-tags.route';
import initUserTags from './user-tags/user-tags.route';
import initSubscribers from './subscribers/subscribers.route';
import initPostVotes from './post-votes/post-votes.route';
import initFollowers from './followers/followers.route';
import initClasses from './classes/classes.route';
import initActivities from './activities/activities.route';
import initActivityTypes from './activity-types/activity-types.route';


function initRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.register(oembedRoutes);
  server.register(initAdminRoutes);
  server.register(initUsersRoutes);
  server.register(initTagsRoutes);
  server.register(docPath);
  server.register(initTokensRoutes);
  server.register(initPostsRoutes);
  server.register(initCoursesRoutes);
  server.register(initChaptersRoutes);
  server.register(initUserCourses);
  server.register(initUserChapters);
  server.register(mailerPath);
  server.register(initEvents);
  server.register(initPostTags);
  server.register(initUserTags);
  server.register(initSubscribers);
  server.register(initPostVotes);
  server.register(initFollowers);
  server.register(initClasses);
  server.register(initActivities);
  server.register(initActivityTypes);

  done();
}

export default initRoutes;
