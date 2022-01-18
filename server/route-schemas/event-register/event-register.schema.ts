import { BAD_REQUEST } from 'route-schemas/response';


export const createEventRegistrationSchema = {
  summary: 'Register event attendees',
  description: 'A POST route to register a user to an event',
  tags: ['Event Register'],
  body:  {
    type: 'object',
    required: ['event_id', 'email', 'full_name'],
    properties: {
      event_id: {
        type: 'number',
        description: 'Id of the event'
      },
      email: {
        type: 'string',
        description: 'Email of the user'
      },
      full_name: {
        type: 'string',
        description: 'Full name of the user'
      }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getEventAttendeesSchema = {
  summary: 'Ger event attendees',
  description: 'To Get all users registered for a specific event',
  tags: ['Event Register'],
  params: {
    type: 'object',
    properties: {
      event_id: { type: 'number', description: 'Id of the event' }
    }
  },
  querystring: {
    type: 'object',
    properties: {
      page: {
        type: 'number',
        default: 1,
        description: 'Page number'
      },
      limit: {
        type: 'number',
        default: 10,
        description: 'Number of datas to be fetched'
      },
      order: {
        type: 'string',
        default: 'DESC',
        description: 'Order of fetching datas'
      },
      sort_field: {
        type: 'string',
        default: 'created_at',
        description: 'Field by which datas are to be sorted by'
      }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const deleteEventAttendeeSchema = {
  summary: 'Delete event attendee',
  description: 'To Delete a user for a specific event',
  tags: ['Event Register'],
  params: {
    type: 'object',
    properties: {
      event_id: { type: 'number', description: 'Id of the event' },
      user_id: { type: 'number', description: 'Id of the user' }
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
