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
  summary: 'Get yearly user Activity',
  description: 'Route to get yearly user activities',
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

export const getUserActivityPointsSchema = {
  summary: 'Get user activity points',
  description: 'Route to get user activity points information',
  tags: ['Activities'],
  params: {
    type: 'object',
    properties: {
      user_id: {type: 'number', description: 'Id of the user'}
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getLeaderBoardSchema = {
  summary: 'Get activity points leader board',
  description: 'Route to get activity points leader board data',
  tags: ['Activities'],
  querystring: {
    type: 'object',
    properties: {
      page: {
        type: 'number',
        default: 1,
        description: 'Page number'
      },
      limit: {
        type: 'number',
        default: 10,
        description: 'Number of datas to be fetched'
      }
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
