import { BAD_REQUEST } from 'route-schemas/response';


export const createActivitySchema = {
  summary: 'Create Activity',
  description: 'A POST route to create an activity',
  tags: ['Activities'],
  body:  {
    type: 'object',
    required: ['name', 'class_name', 'activity_type_name'],
    properties: {
      name: {
        type: 'string',
        description: 'Name of the activity'
      },
      class_name: {
        type: 'string',
        description: 'Name of the class'
      },
      activity_type_name: {
        type: 'string',
        description: 'Name of the Activity type'
      },
      event_id: {
        type: 'string',
        description: 'Id of the event'
      },
      post_id: {
        type: 'string',
        description: 'Id of the post'
      }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getUserYearlyActivitiesSchema = {
  summary: 'Create Activity',
  description: 'A POST route to create an activity',
  tags: ['Activities'],
  params: {
    type: 'object',
    properties: {
      user_id: {type: 'number', description: 'Id of the user'}
    }
  },
  querystring: {
    type: 'object',
    required: ['year'],
    properties: {
      year: {type: 'number', description: 'The year specified for the activities to be fetched'}
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const deleteActivitySchema = {
  summary: 'Delete Activity',
  description: 'To Delete an activity',
  tags: ['Activities'],
  params: {
    type: 'object',
    properties: {
      activity_id: { type: 'number', description: 'Id of the Activity' }
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
