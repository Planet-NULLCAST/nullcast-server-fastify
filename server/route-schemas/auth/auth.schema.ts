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
    201: {
      description: 'User created success.',
      type: 'object',
      properties: {
        message: {
          default: 'Response Message',
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
