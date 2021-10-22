import { BAD_REQUEST } from 'route-schemas/response';
import { queryStringProps } from 'route-schemas/shared-schemas/shared.properties';
import { eventProps } from './event.properties';


export const createEventSchema = {
  summary: 'Create Event',
  description: 'A Post route to create an event and store its data',
  tags: ['Event'],
  body: {
    type: 'object',
    properties: {
      ...eventProps
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getEventSchema = {
  summary: 'Get Event',
  description: 'To get Event information by id',
  tags: ['Event'],
  params: {
    type: 'object',
    properties: {
      eventId: { type: 'number', description: 'Id of the Event' }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getEventsByUserIdSchema = {
  summary: 'Get Events',
  description: 'To get Event information by id',
  tags: ['Event'],
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['id', 'created_at', 'created_by', 'status', 'published_at', 'banner_image',
          'updated_at', 'meta_title', 'description', 'location', 'primary_tag', 'event_time'],
        example: `['id', 'created_at', 'created_by', 'status']`
      },
      ...queryStringProps('events')
    }
  },
  params: {
    type: 'object',
    properties: {
      userId: { type: 'number', description: 'Id of the User' }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const updateEventSchema = {
  summary: 'Update Event',
  description: 'A PUT route to update data in events',
  tags: ['Event'],
  params: {
    type: 'object',
    properties: {
      eventId: {
        type: 'number',
        description: 'Id of the Event'
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      ...eventProps,
      updated_by: {
        type: 'number',
        description: 'user whom have updated it'
      },
      updated_at: {
        type: 'string',
        description: 'Date and time of the updation'
      }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

// export const getEventsSchema = {
//   summary: 'Get Events',
//   description: 'To get Event information',
//   tags: ['Event'],
//   querystring: {
//     type: 'object',
//     properties: {
//       limit_fields: {
//         type: 'array',
//         description: 'The fields that are needed to be returned',
//         default: ['id', 'slug', 'created_by', 'html', 'mobiledoc', 'created_at',
//           'published_at', 'banner_image', 'title', 'meta_title'],
//         example: `['id', 'slug', 'created_by']`
//       },
//       ...queryStringProps('Event')
//     }
//   },
//   response: {
//     400: BAD_REQUEST
//   }
// };

export const deleteEventSchema = {
  summary: 'Delete Event',
  description: 'To Delete Event information',
  tags: ['Event'],
  params: {
    type: 'object',
    properties: {
      eventId: { type: 'string', description: 'Id of the Event' }
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
