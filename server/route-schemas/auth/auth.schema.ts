export const signInSchema = {
  summary: 'Sign In',
  description: 'A POST route to sign in to user account',
  tags: ['User'],
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        description: 'Email Id of the user'
      },
      password: {
        type: 'string',
        description: 'Password of the user account'
      }
    }
  },
  response: {
    200: {
      description: 'Token issued ',
      type: 'object',
      properties: {
        message: {
          type: 'string'
        },
        user: {
          type: 'object',
          properties:{
            id: {
              type: 'string'
            },
            user_name: {
              type: 'string'
            },
            full_name: {
              type: 'string'
            }
          }
        }
      }
    },
    401: {
      description: 'Unauthorized request',
      type: 'object',
      properties: {
        message: {
          type: 'string'
        }
      }
    }
  }
};
