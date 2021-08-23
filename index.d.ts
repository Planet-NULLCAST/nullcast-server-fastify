/// <reference types="node" />

import {} from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      user_name: string;
      id: string;
    } | null;
  }
}
