import  controller  from "../controller/index";
// import { UserType } from '../route-schemas/users/user.schema';
// import { RouteOptions } from "fastify";
// import { FastifyInstance } from "fastify/types/instance";
import { createUserSchema } from "../route-schemas/users/user.schema"
import * as fs from 'fs';
import * as path from 'path';
const stream = fs.createReadStream(path.resolve('./redoc.html'));

//-- Route Options --//
const postUserOpts = {
    createUserSchema,
    handler: controller.createUserController
}


function initUsers(server: any) {
    //-- Doc Route --//
    server.get('/api/doc', 
    (req: any, rep: any) => {
        console.log(req);
        
        rep.type('text/html').send(stream);
    })

    //-- Create User --//
    server.post("/userPost", postUserOpts);
}

export default initUsers;