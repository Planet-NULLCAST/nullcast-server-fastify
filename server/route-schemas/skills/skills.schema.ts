// import { FastifySchema, RequestBodyDefault } from "fastify";

// const skillsRequestBody:RequestBodyDefault = {
//     id: 'https://example.com/schemas/skills',
//     type: 'object',
//     required: ['name', 'user_id'],
//     properties: {
//         name: {
//             type: 'string',
//             description: 'Name of the skill'
//         },
//         user_id: { $ref: 'http://example.com/schemas/user#/properties' }
//     }
// }

// export const createSkillsSchema: FastifySchema = {
//     description: 'Create skills',
//     tags: ['user', 'skills'],
//     body: skillsRequestBody,
//     response: {
//         200: {
//             description: 'Skills created'
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