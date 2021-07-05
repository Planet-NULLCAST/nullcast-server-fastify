import { FastifySchema, RequestBodyDefault } from "fastify";

const userRequestBody:RequestBodyDefault = {
    type: 'object',
    required: ['userName', 'fullName', 'email','password'],
    properties: {
      userName: {
          type: 'string',
          description: 'user provided username'
      },
      fullName: {
          type: 'string',
          description: 'user provided full name'
      },
      email: {
          type: 'string',
          description: 'user email',
      },
      password: {
          type: 'string',
          description: 'user password'
      },
      coverImage: {
          type: 'string',
      },
      bio: {
          type: 'string'
      }
    }
}

export const createUserSchema: FastifySchema = {
    description: 'Create a user',
    tags: ['user','create'],
    body:  userRequestBody,
    response: {
        201: {
            description: 'User created success.',

        },
        400: {
            description: 'Bad request',
            type: 'object',
            properties: {
                message: {
                    type: 'string'
                }
            }
        }
    }
}
