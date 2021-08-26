import {FastifyInstance} from 'fastify';
import cors from 'fastify-cors';


export function fastifyCorsPlugin(server:FastifyInstance) {
  //To enable CORS in fastify
  server.register(cors, {
    origin: 'http://localhost:3000',
    methods:['POST', 'GET', 'PUT', 'DELETE'],
    allowedHeaders: ['Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'],
    credentials: true,
    exposedHeaders: ['set-cookie']
  });
}
