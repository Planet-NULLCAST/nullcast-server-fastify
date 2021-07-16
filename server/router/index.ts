import { FastifyInstance } from "fastify";
import initUsersRoutes from "./users.route";

function initRoutes(server: FastifyInstance) {
    
    initUsersRoutes(server);
    
}

export default initRoutes;