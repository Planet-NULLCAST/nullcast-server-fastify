import { BAD_REQUEST } from 'route-schemas/response';
import { userProps } from './user.properties';
import { queryStringProps } from 'route-schemas/shared-schemas/shared.properties';


export const createUserSchema = {
  summary: 'Create User',
  description: 'A POST route to create register user information',
  tags: ['User'],
  body:  {
    type: 'object',
    required: ['user_name', 'full_name', 'email', 'password'],
    properties: {
      password: {
        type: 'string',
        description: 'user password'
      },
      ...userProps
    }
  },
  response: {
    201: {
      description: 'User created successfully.',
      type: 'object',
      properties: {
        message: {
          type: 'string'
        },
        user: {
          type: 'object',
          properties:{
            id: {
              type: 'number',
              description: 'userId of the user'
            },
            user_name: {
              type: 'string',
              description: 'user name of the user'
            },
            full_name: {
              type: 'string',
              description: 'full name of the user'
            },
            avatar: {
              type: 'string',
              description: 'Avatar of the user'
            }
          }
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
};

export const getUserSchema = {
  summary: 'Get User',
  description: 'To get user information',
  tags: ['User'],
  params: {
    type: 'object',
    required: ['user_name'],
    properties: {
      user_name: { type: 'string', description: 'user name of user' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: {
          type: 'string'
        },
        data: {
          type: 'object',
          properties: userProps
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
};

export const updateUserSchema = {
  summary: 'Update User',
  description: 'A PUT route to update register user information',
  tags: ['User'],
  params: {
    type: 'object',
    properties: {
      userId: { type: 'number', description: 'UserId of user' }
    }
  },
  body:  {
    type: 'object',
    required: ['password'],
    properties: {
      password: {
        type: 'string',
        description: 'user password'
      },
      ...userProps
    }
  },
  response: {
    // 200: {
    //   description: 'User created success.',
    //   type: 'object',
    //   properties: {
    //     message: {
    //       type: 'string'
    //     }
    //   }
    // },
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
};

export const deleteUserSchema = {
  summary: 'Delete User',
  description: 'To Delete user information',
  tags: ['User'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      userId: { type: 'number', description: 'UserId of user' }
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
};

export const getUsersSchema = {
  summary: 'Get users',
  description: 'To get user information',
  tags: ['User'],
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['user_name', 'full_name', 'avatar'],
        example: `['id', 'user_name', 'full_name', 'avatar']`
      },
      ...queryStringProps('user')
    }
  },
  response: {
    400: BAD_REQUEST
  }
};
