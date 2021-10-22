import { BAD_REQUEST } from 'route-schemas/response';
import userCourseProps from './user-courses.properties';


export const enrolUserCourseSchema = {
  summary: 'Enrol User to a Course',
  description: 'A POST route to add user-course information',
  tags: ['User_course'],
  body:  {
    type: 'object',
    required: ['course_id'],
    properties: {
      course_id: {
        type: 'number',
        description: 'Id of the Course'
      },
      status: {
        type: 'string',
        description: 'Progress of the course by the user',
        default: 'in_progress'
      }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getUserCourseSchema = {
  summary: 'Get User Course',
  description: 'To get userCourse information',
  tags: ['User_course'],
  params: {
    type: 'object',
    properties: {
      user_course_id: { type: 'number', description: 'Id of the userCourse' }
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
            status: {
              type: 'string',
              description: 'Progress of the course by the user',
              default: 'in_progress'
            },
            ...userCourseProps()
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const updateUserCourseSchema = {
  summary: 'Update User Course',
  description: 'A PUT route to update userCourse information',
  tags: ['User_course'],
  params: {
    type: 'object',
    properties: {
      user_course_id: { type: 'number', description: 'Id of the userCourse' }
    }
  },
  body:  {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        description: 'Progress of the course by the user',
        default: 'in_progress'
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
            status: {
              type: 'string',
              description: 'Progress of the course by the user',
              default: 'in_progress'
            },
            ...userCourseProps()
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const deleteUserCourseSchema = {
  summary: 'Delete User Course',
  description: 'To Delete userCourse information',
  tags: ['User_course'],
  params: {
    type: 'object',
    properties: {
      user_course_id: { type: 'number', description: 'Id of userCourse' }
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
