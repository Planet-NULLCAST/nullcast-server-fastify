import { BAD_REQUEST } from 'route-schemas/response';
import { chapterProps } from './chapter.properties';


export const createChapterSchema = {
  summary: 'Create Chapter',
  description: 'A POST route to add Chapter information',
  tags: ['Chapter'],
  body:  {
    type: 'object',
    required: ['name', 'course_name', 'chapter_no'],
    properties: {
      ...chapterProps('course_name')
    }
  },
  response: {
    201: {
      description: 'Chapter added successfully.',
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
              description: 'Id of the Chapter'
            },
            ...chapterProps(),

            created_by: {
              type: 'number',
              description: 'User whom added the Chapter'
            },
            created_at: {
              type: 'string',
              description: 'Date and time of adding the Chapter'
            }
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const addChaptersSchema = {
  summary: 'Add Chapters',
  description: 'A POST route to add and update multiple Chapters information',
  tags: ['Chapter'],
  body:  {
    type: 'array',
    maxItems: 5,
    minItems: 1,
    items: {
      type: 'object',
      required: ['name', 'course_name', 'chapter_no'],
      properties: {
        ...chapterProps('course_name')
      }
    }
  },
  response: {
    201: {
      description: 'Chapters  added successfully.',
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
              description: 'Id of the Chapter'
            },

            ...chapterProps(),

            created_by: {
              type: 'number',
              description: 'User whom created'
            },
            created_at: {
              type: 'string',
              description: 'Date and Time of adding the Chapter'
            }
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const getChapterSchema = {
  summary: 'Get Chapter',
  description: 'To get Chapter information',
  tags: ['Chapter'],
  params: {
    type: 'object',
    properties: {
      chapter_name: { type: 'number', description: 'Name of the Chapter' }
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
              description: 'Id of the Chapter'
            },
            created_by: {
              type: 'number',
              description: 'UserId of whomever that adds the Chapter'
            },
            ...chapterProps()
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const updateChapterSchema = {
  summary: 'Update Chapter',
  description: 'A PUT route to update Chapter information',
  tags: ['Chapter'],
  params: {
    type: 'object',
    properties: {
      ChapterId: { type: 'number', description: 'Id of the Chapter' }
    }
  },
  body:  {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the Chapter'
      },
      chapter_no: {
        type: 'number',
        description: 'Serial number of the Chapter'
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
              description: 'Id of the Chapter'
            },
            updated_by: {
              type: 'number',
              description: 'UserId of whomever that updates the Chapter'
            },
            updated_at: {
              type: 'string',
              description: 'Date and time of update'
            },
            ...chapterProps('course_id')
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const deleteChapterSchema = {
  summary: 'Delete Chapter',
  description: 'To Delete Chapter information',
  tags: ['Chapter'],
  params: {
    type: 'object',
    properties: {
      ChapterId: { type: 'number', description: 'Id of Chapter' }
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
