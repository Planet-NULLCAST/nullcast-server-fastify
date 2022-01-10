import { BAD_REQUEST } from 'route-schemas/response';


export const createClassSchema = {
  summary: 'Create Class',
  description: 'A POST route to add a class',
  tags: ['Classes'],
  body:  {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        description: 'Name of the class'
      },
      description: {
        type: 'string',
        description: 'Description of the class'
      },
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const deleteClassSchema = {
  summary: 'Delete Class',
  description: 'To Delete a class',
  tags: ['Classes'],
  params: {
    type: 'object',
    properties: {
      class_name: { type: 'string', description: 'Name of the Class' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: {
          type: 'string'
        }
      }
    },
    400: BAD_REQUEST
  }
};
