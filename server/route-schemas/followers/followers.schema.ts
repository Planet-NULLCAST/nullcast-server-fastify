import { BAD_REQUEST } from 'route-schemas/response';


export const addFollowerSchema = {
  summary: 'Add Follower',
  description: 'A POST route to add a follower to a user',
  tags: ['Follower'],
  body: {
    type: 'object',
    required: ['following_id'],
    properties: {
      following_id: {
        type: 'number',
        description: 'Id of the user who is to be followed'
      }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getFollwersSchema = {
  summary: 'Get Followers',
  description: 'To get followers information',
  tags: ['Follower'],
  params: {
    type: 'object',
    properties: {
      following_id: { type: 'number', description: 'Id of the user who is to be followed' }
    }
  },
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

export const removeFollwerSchema = {
  summary: 'Remove Follower',
  description: 'A DELETE route to unfollow a user',
  tags: ['Follower'],
  params: {
    type: 'object',
    properties: {
      following_id: {
        type: 'number',
        description: 'Id of the user who is to be followed'
      }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};
