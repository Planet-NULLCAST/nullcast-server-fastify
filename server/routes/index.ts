import { FastifyInstance } from "fastify";
import oembedRoutes from "./embed.route";
import initUsersRoutes from "./users/users.route";

function initRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.register(oembedRoutes);
  server.register(initUsersRoutes);

  done();
}

export default initRoutes;