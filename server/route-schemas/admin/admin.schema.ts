import { eventProps } from 'route-schemas/events/event.properties';
import { BAD_REQUEST } from 'route-schemas/response';


export const createAdminEventSchema = {
  summary: 'Admin create Event',
  description: 'A Post route for the admin to create an event and store its data',
  tags: ['Admin'],
  body: {
    type: 'object',
    properties: {
      ...eventProps('admin')
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const adminReviewPostSchema = {
  summary: 'Admin post review',
  description: 'Route to review post by admin',
  tags: ['Admin'],
  params: {
    type: 'object',
    properties: {
      post_id: {
        type: 'number',
        description: 'Id of the post'
      }
    }
  },
  respone: {
    400: BAD_REQUEST
  }
};

export const adminReviewEventSchema = {
  summary: 'Admin eveny review',
  description: 'Route to review event by admin',
  tags: ['Admin'],
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
      ...eventProps('admin'),
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

export const checkAdminSchema = {
  summary: 'Check Admin',
  description: 'Route to check if the user has admin access',
  tags: ['Admin'],
  response: {
    400: BAD_REQUEST
  }
};
