import { FastifySchema } from "fastify";

// const userRequestBody:RequestBodyDefault = {
//     // $id: 'https://example.com/schemas/user',
//     type: 'object',
//     required: ['user_name', 'full_name', 'email','password'],
//     properties: {
//       user_name: {
//           type: 'boolean',
//           description: 'user provided username'
//       },
//       full_name: {
//           type: 'string',
//           description: 'user provided full name'
//       },
//       email: {
//           type: 'string',
//           description: 'user email',
//       },
//       password: {
//           type: 'string',
//           description: 'user password'
//       },
//       coverImage: {
//           type: 'string',
//       },
//       bio: {
//           type: 'string'
//       }
//     }
// }

export const createUserSchema: FastifySchema = {
    description: 'Create a user',
    tags: ['user','create'],
    body:  {
        type: 'object',
    required: ['user_name', 'full_name', 'email','password'],
    properties: {
      user_name: {
          type: 'string',
          description: 'user provided username'
      },
      full_name: {
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
    },
    response: {
        201: {
            description: 'User created success.',
            type: 'object',
            properties: {
                message: {
                    type: 'string'
                }
            }
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

// export const getUserSchema: FastifySchema = {
//     description: 'Get a user',
//     tags: ['user','get'],
//     response: {
//         200: {
//             type: 'object',
//             properties: {
//                 message: {
//                     type: 'string'
//                 }
//             }
//         },
//         400: {
//             description: 'Bad request',
//             type: 'object',
//             properties: {
//                 message: {
//                     type: 'string'
//                 }
//             }
//         }
//     }
// }