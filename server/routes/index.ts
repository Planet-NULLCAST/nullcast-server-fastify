import { FastifyInstance } from "fastify";
import oembedRoutes from "./embed.route";
import initUsersRoutes from "./users/users.route";
import docPath from "./doc.route";

function initRoutes(server: FastifyInstance, _: any, done: () => void) {
  server.register(oembedRoutes);
  server.register(initUsersRoutes);
  server.register(docPath);

  done();
}

export default initRoutes;