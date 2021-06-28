import { FastifyInstance } from "fastify";
import homePath from "./home";
import initUsersRoutes from "./users";

function initRoutes(server:FastifyInstance) {

    homePath(server); //homeRoutes didn't seem to be a nice name :)
    initUsersRoutes(server);
}

export default initRoutes;