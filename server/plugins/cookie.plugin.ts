import { FastifyCookieOptions } from 'fastify-cookie';
import cookie from 'fastify-cookie';
import { FastifyInstance } from "fastify";

export function fastifyCookiePlugin(server: FastifyInstance) {
    server.register(cookie, {
        parseOptions: ''
    } as FastifyCookieOptions);
}