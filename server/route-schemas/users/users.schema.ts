
export const createUserSchema = {
    summary: 'Create User',
    description: 'A POST route to create register user information',
    tags: ['User'],
    body:  {
        type: 'object',
        required: ['user_name', 'full_name', 'email','password'],
        properties: {
          user_name: {
              type: 'string',
              description: 'user provided username'
            },
          full_name: {
              type: 'string',
              description: 'user provided full name'
            },
          email: {
              type: 'string',
              description: 'user email',
            },
          password: {
              type: 'string',
              description: 'user password'
            },
            coverImage: {
                type: 'string',
                description: 'cover image s3 url'
            },
            bio: {
                type: 'string',
                description: 'Bio of the user'
            }
        }
    },
    response: {
        201: {
            description: 'User created success.',
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
}

export const updateUserSchema = {
    summary: 'Update User',
    description: 'A PUT route to update register user information',
    tags: ['User'],
    params: {
        type: 'object',
        required: ['user_name'],
        properties: {
            user_name: { type: 'string', description: 'user name of user' }
        }
    },
    body:  {
        type: 'object',
        properties: {
          user_name: {
              type: 'string',
              description: 'user provided username'
            },
          full_name: {
              type: 'string',
              description: 'user provided full name'
            },
          email: {
              type: 'string',
              description: 'user email',
            },
          password: {
              type: 'string',
              description: 'user password'
            },
            coverImage: {
                type: 'string',
                description: 'cover image s3 url'
            },
            bio: {
                type: 'string',
                description: 'Bio of the user'
            }
        }
    },
    response: {
        201: {
            description: 'User created success.',
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
}

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
}

export const deleteUserSchema = {
    summary: 'Delete User',
    description: 'To Delete user information',
    tags: ['User'],
    params: {
        type: 'object',
        required: ['user_name'],
        properties: {
            user_name: { type: 'string', description: 'user name of user' }
        }
    },
    response: {
        201: {
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
}