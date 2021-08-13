import { FastifyInstance } from "fastify";
import docPath from "./doc.route";
import homePath from "./home.route";
import initUsersRoutes from "./users";
// import initSkillRoutes from "./skills";

function initRoutes(server:FastifyInstance) {
    docPath(server); // documentation path
    homePath(server); //homeRoutes didn't seem to be a nice name :)
    initUsersRoutes(server);
}

export default initRoutes;