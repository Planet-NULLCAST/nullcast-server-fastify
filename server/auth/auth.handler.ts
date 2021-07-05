import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import controller from '../controllers/index'
function authHandler (server:FastifyInstance) {    
    server.addHook('preHandler', server.auth([
        emailAuth
    ]));
}

async function emailAuth (request:FastifyRequest , _: FastifyReply, done: (error?: Error | undefined) => void  )  {

    const authData = request.headers.authorization as string;
    if(!authData) {
        console.log('authorization data not found');
        done();
        // done(new Error("Missing username or password"));
    } 

    const buffer = Buffer.from(authData.split(' ')[1] as string, 'base64');
    const [username, password] = buffer.toString('utf-8').split(':');
    const validated = await controller.validateUserController({userName: username as string,password: password as string});
    if(validated) {
        console.log('user exist in DB');
        done();        
    } else {
        console.log('Authorization params not match');
        done();
       
    }
    
}

export default authHandler;