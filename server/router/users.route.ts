import  controller  from "../controller/index";
import { UserType } from '../route-schemas/users/user.schema';
import { RouteOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance";
import * as fs from 'fs';
import * as path from 'path';
const stream = fs.createReadStream(path.resolve('../../documentationUi/redoc.html'));

const createUser: RouteOptions = {
    method: 'POST',
    url: '/userPost',
    handler: async (request, reply) => {
        try {
            const { body: userData } = request;
            const userStatus = await controller.createUserController(userData as UserType);

            if(userStatus) {
                reply.code(201).send({message: 'User created'});
            } else {
                reply.code(500).send({message:'Something Error happend'});
            }

        } catch (error) {
            throw error;
        }
    } 
}

function initUsers(server: FastifyInstance) {
    server.route(createUser);

    //-- 2nd Route Method --//

    server.get('/api/doc', 
    (req, rep) => {
        console.log(req);
        
        rep.type('text/html').send(stream);
    })

    server.post(
        "/userPost",
        async (request, reply) => {
            const { body: userData } = request;
            const userStatus = await controller.createUserController(userData as UserType);
            
            if(userStatus) {
                reply.code(201).send({message: 'User created'});
            } else {
                reply.code(500).send({message:'Something Error happend'});
            }

        }
    );

    
}

export default initUsers;