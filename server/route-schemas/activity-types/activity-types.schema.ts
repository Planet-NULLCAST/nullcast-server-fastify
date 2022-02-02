import { BAD_REQUEST } from 'route-schemas/response';


export const createActivityTypeSchema = {
  summary: 'Create Activity Types',
  description: 'A POST route to create an activity type',
  tags: ['Activity Types'],
  body:  {
    type: 'object',
    required: ['name', 'class_name', 'points'],
    properties: {
      name: {
        type: 'string',
        description: 'Name of the activity type'
      },
      class_name: {
        type: 'string',
        description: 'Name of the class'
      },
      points: {
        type: 'number',
        description: 'Number of points for this activity type'
      }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const deleteActivityTypeSchema = {
  summary: 'Delete Activity Types',
  description: 'To Delete an activity type',
  tags: ['Activity Types'],
  params: {
    type: 'object',
    properties: {
      activity_type_id: { type: 'number', description: 'Id of the Activity type' }
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
