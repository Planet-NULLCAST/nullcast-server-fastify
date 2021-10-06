import { BAD_REQUEST } from 'route-schemas/response';

export const mailerHealthSchema = {
  summary: 'Mailer Route',
  description: 'To check if mailer client is working or not',
  tags: ['Mailer'],
  response: {
    200: {
      description: 'Request Succeeded',
      type: 'object',
      properties: {
        message: { type: 'string', description: 'response message' }
      }
    },
    400: BAD_REQUEST
  }
};

export const forgotPassSchema = {
  summary: 'Mailer Route',
  description: 'To check if mailer client is working or not',
  tags: ['Mailer'],
  body: {
    type: 'object',
    required: ['to'],
    properties: {
      to: {
        type: 'string',
        description: 'user should provide email id'
      }
    }
  },
  response: {
    200: {
      description: 'Request Succeeded',
      type: 'object',
      properties: {
        message: { type: 'string', description: 'response message' }
      }
    },
    400: BAD_REQUEST
  }
};
