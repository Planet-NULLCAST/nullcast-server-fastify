import {FastifyInstance} from 'fastify/types/instance';
import post from './posts.routes';


function initPostsRoutes(server:FastifyInstance) {
  post(server);
}

export default initPostsRoutes;
