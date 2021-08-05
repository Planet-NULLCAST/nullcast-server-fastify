import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import controller from '../controllers/index'
import jwt from 'jsonwebtoken';

function authHandler(server: FastifyInstance) {
    server.addHook('preHandler', server.auth([
        jwtAuth,
        basicAuth
    ]));
}

async function basicAuth(request: FastifyRequest, _: FastifyReply) {
    const authData = request.headers.authorization as string;
    if (!authData) {
        console.log('authorization data not found');
        throw new Error("Auth data missing");
    }

    const authString = authData.split(' ')[1];
    console.log("Authstring ", authString);

    if (authString) {
        const buffer = Buffer.from(authString, 'base64');
        const [username, password] = buffer.toString('utf-8').split(':');
        console.log(username, password);

        if (username && password) {
            const validated = await controller.validateUserController({ userName: username as string, password: password as string });
            console.log("Is validated", validated);

            if (validated) {
                console.log('user exist in DB');
                return;
            } else {
                console.log('Authorization params error');
                throw new Error('Authorization params error');
                // done(new Error("Authorization params not matched"));
            }
        }
    }

    throw new Error("Missing username or password");
}

async function jwtAuth(request: FastifyRequest, _: FastifyReply) {
    if (request.cookies && request.cookies.token) {

        const token = request.cookies.token as string;
        const verificationStatus = jwt.verify(token, process.env.JWT_KEY as string, { algorithms: ['HS256'] });
        console.log(typeof verificationStatus);

        if (verificationStatus && typeof verificationStatus === 'object' && (Math.floor(Date.now() / 1000) < (verificationStatus as any).exp  )) {
            const validated = await controller.validateUserController({ userName: verificationStatus.userName as string, password: verificationStatus.password as string });
            
            if (validated) {
                console.log(verificationStatus);
                return;
            }
        }
    }

    throw new Error('Jwt auth failed');


}

export default authHandler;