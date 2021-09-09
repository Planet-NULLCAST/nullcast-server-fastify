import { userProps } from './user.properties';


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
      created_by: {
        type: 'string',
        description: 'Bio of the user'
      },
      created_at: {
        type: 'string',
        description: 'Bio of the user'
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

export const updateUserSchema = {
  summary: 'Update User',
  description: 'A PUT route to update register user information',
  tags: ['User'],
  body:  {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        description: 'user password'
      },
      updated_at: {
        type: 'string',
        description: 'Bio of the user'
      },
      updated_by: {
        type: 'string',
        description: 'Bio of the user'
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

export const deleteUserSchema = {
  summary: 'Delete User',
  description: 'To Delete user information',
  tags: ['User'],
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
