import { FastifyInstance } from "fastify/types/instance";
import users from "./users";


function initUsersRoutes(server:FastifyInstance) {
    users(server)
}

export default initUsersRoutes;