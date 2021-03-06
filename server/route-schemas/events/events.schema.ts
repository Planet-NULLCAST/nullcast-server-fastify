import { BAD_REQUEST } from 'route-schemas/response';
import { queryStringProps } from 'route-schemas/shared-schemas/shared.properties';
import { eventProps } from './event.properties';


export const requestEventSchema = {
  summary: 'Request Event',
  description: 'A Post route to create an event with status pending and store its data',
  tags: ['Event'],
  body: {
    type: 'object',
    properties: {
      ...eventProps('user')
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

export const getEventBySlugSchema = {
  summary: 'Get Event by slug',
  description: 'To get Event information by slug',
  tags: ['Event'],
  params: {
    type: 'object',
    properties: {
      slug: { type: 'string', description: 'Url of the Event' }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getEventsSchema = {
  summary: 'Get Events',
  description: 'To get All published Event information',
  tags: ['Event'],
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['id', 'title', 'guest_name', 'guest_designation', 'guest_image', 'registration_link', 'guest_bio', 'created_at', 'created_by',
          'slug', 'status', 'published_at', 'banner_image', 'updated_at', 'meta_title', 'description', 'location', 'primary_tag', 'event_time'],
        example: `['id', 'created_at', 'created_by', 'status']`
      },
      ...queryStringProps('events')
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getEventsByUserIdSchema = {
  summary: 'Get Events By UserId',
  description: 'To get published Events information by userId',
  tags: ['Event'],
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['id', 'title', 'guest_name', 'guest_designation', 'guest_image', 'registration_link', 'guest_bio', 'created_at', 'created_by',
          'slug', 'status', 'published_at', 'banner_image', 'updated_at', 'meta_title', 'description', 'location', 'primary_tag', 'event_time'],
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

export const getAllEventUrlSchema = {
  summary: 'Get all events slug',
  description: 'To get all events slug information',
  tags: ['Event'],
  response: {
    200: {
      message: {
        type: 'string'
      },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            slug: { type: 'string', description: 'Url of the event'}
          }
        }
      }
    },
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
      ...eventProps('user'),
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
