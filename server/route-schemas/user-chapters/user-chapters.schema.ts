import { BAD_REQUEST } from 'route-schemas/response';
import userChapterProps from './user-chapters.properties';


export const createUserChapterSchema = {
  summary: 'Add on completion of a chapter by a user',
  description: 'A POST route to add userChapter information',
  tags: ['User_chapter'],
  body:  {
    type: 'object',
    required: ['course_id', 'chapter_id'],
    properties: {
      ...userChapterProps()
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getUserChapterSchema = {
  summary: 'Get User Chapter',
  description: 'To get userChapter information',
  tags: ['User_chapter'],
  params: {
    type: 'object',
    properties: {
      user_chapter_id: { type: 'number', description: 'Id of the userChapter' }
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
          properties: {
            id: {
              type: 'number',
              description: 'Id of the course'
            },
            created_by: {
              type: 'number',
              description: 'UserId of whomever that adds the course'
            },
            created_at: {
              type: 'string',
              description: 'Date and time of the creation'
            },
            ...userChapterProps()
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const getUserChapterProgressSchema = {
  summary: 'Get User Chapter Progress',
  description: 'To get progrss of chapters by user',
  tags: ['User_chapter'],
  querystring: {
    type: 'object',
    required: ['user_id', 'course_id'],
    properties: {
      user_id: {
        type: 'number',
        description: 'Id of the User'
      },
      course_id: {
        type: 'number',
        description: 'Id of the Course'
      }
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
          properties: {
            total:{
              type: 'number',
              description: 'Total number of chapters in the selected course'
            },
            completed:{
              type: 'number',
              description: `Total number of chapters
                   completed by the user in the selected course`
            }
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const updateUserChapterSchema = {
  summary: 'Update User Chapter',
  description: 'A PUT route to update userChapter information',
  tags: ['User_chapter'],
  params: {
    type: 'object',
    properties: {
      user_chapter_id: { type: 'number', description: 'Id of the userChapter' }
    }
  },
  body:  {
    type: 'object',
    properties: {
      chapter_id: {
        type: 'number',
        description: 'Id of the userChapter'
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
            id: {
              type: 'number',
              description: 'Id of the course'
            },
            updated_by: {
              type: 'number',
              description: 'UserId of whomever that adds the course'
            },
            updated_at: {
              type: 'string',
              description: 'Date and time of the creation'
            },
            ...userChapterProps()
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const deleteUserChapterSchema = {
  summary: 'Delete User Chapter',
  description: 'To Delete userChapter information',
  tags: ['User_chapter'],
  params: {
    type: 'object',
    properties: {
      user_chapter_id: { type: 'number', description: 'Id of userChapter' }
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
