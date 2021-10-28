import { BAD_REQUEST } from 'route-schemas/response';
import { queryStringProps } from 'route-schemas/shared-schemas/shared.properties';


export const createUserTagSchema = {
  summary: 'Add Tag for a user',
  description: 'A POST route to add user-course information',
  tags: ['User_tag'],
  body:  {
    type: 'object',
    required: ['tag_id'],
    properties: {
      tag_id: {
        type: 'number',
        description: 'Id of the Tag'
      }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getUserTagsSchema = {
  summary: 'Get User Tags by userId',
  description: 'To get userTag information',
  tags: ['User_tag'],
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['user_id', 'tag_id', 'created_by', 'created_at'],
        example: `['id', 'created_at', 'created_by', 'status']`
      },
      ...queryStringProps('user_tags')
    }
  },
  params: {
    type: 'object',
    properties: {
      user_id: { type: 'number', description: 'Id of the user' }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const updateUserTagSchema = {
  summary: 'Update User Tag',
  description: 'A PUT route to update userTag information',
  tags: ['User_tag'],
  params: {
    type: 'object',
    properties: {
      tag_id: { type: 'number', description: 'Id of the tag' }
    }
  },
  body:  {
    type: 'object',
    properties: {
      tag_id: {
        type: 'number',
        description: 'Id of the tag'
      }
    }
  },
  response: {
    200: {
      description: 'User created success.',
      type: 'object',
      properties: {
        message: {
          type: 'string'
        },
        data: {
          type: 'object',
          properties: {
            tag_id: {
              type: 'number',
              description: 'Id of the tag'
            },
            user_id: {
              type: 'number',
              description: 'Id of the user'
            },
            created_by: {
              type: 'number',
              description: 'UserId of whomever that adds the tag'
            },
            created_at: {
              type: 'string',
              description: 'Date and time of the creation'
            }
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const deleteUserTagSchema = {
  summary: 'Delete User Tag',
  description: 'To Delete userTag information',
  tags: ['User_tag'],
  params: {
    type: 'object',
    properties: {
      tag_id: { type: 'number', description: 'Id of tag' }
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
