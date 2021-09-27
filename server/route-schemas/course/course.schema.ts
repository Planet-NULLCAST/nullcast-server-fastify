import { BAD_REQUEST } from 'route-schemas/response';
import { courseProps } from './course.properties';


export const createCourseSchema = {
  summary: 'Create Course',
  description: 'A POST route to add course information',
  tags: ['Course'],
  body:  {
    type: 'object',
    required: ['name', 'certificate_id'],
    properties: {
      ...courseProps
    }
  },
  response: {
    201: {
      description: 'Course added successfully.',
      type: 'object',
      properties: {
        message: {
          type: 'string'
        },
        data: {
          type: 'object',
          properties:{
            id: {
              type: 'number',
              description: 'Id of the course'
            },
            ...courseProps
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const getCourseSchema = {
  summary: 'Get Course',
  description: 'To get course information',
  tags: ['Course'],
  params: {
    type: 'object',
    properties: {
      course_name: { type: 'string', description: 'Name of the course' }
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
            ...courseProps
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const updateCourseSchema = {
  summary: 'Update Course',
  description: 'A PUT route to update Course information',
  tags: ['Course'],
  params: {
    type: 'object',
    properties: {
      courseId: { type: 'number', description: 'Id of the course' }
    }
  },
  body:  {
    type: 'object',
    properties: {
      ...courseProps
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
              description: 'UserId of whomever that updates the course'
            },
            updated_at: {
              type: 'string',
              description: 'Date and time of update'
            },
            ...courseProps
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const deleteCourseSchema = {
  summary: 'Delete Course',
  description: 'To Delete Course information',
  tags: ['Course'],
  params: {
    type: 'object',
    properties: {
      courseId: { type: 'number', description: 'Id of Course' }
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
