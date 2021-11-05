import { BAD_REQUEST } from "route-schemas/response";
import { queryStringProps } from "route-schemas/shared-schemas/shared.properties";

export const addSubscriberSchema = {
  summary: 'Add user Subscribtion',
  description: 'A POST route to add user subscribtion information',
  tags: ['Subscriber'],
  body:  {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        description: 'user email'
      }
    }
  },
  response: {
    201: {
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
              description: 'Id of the subscription'
            },
            email: {
              type: 'string',
              description: 'Email of the subscibed user'
            },
            last_notified: {
              type: 'string',
              description: 'Date and time at which the user has been notified lastly'
            },
            created_at: {
              type: 'string',
              description: 'Date and time of subsciption'
            }
          }
        }
      }
    },
    400: BAD_REQUEST
  }
}

export const getSubscribersSchema = {
  summary: 'Get subscribers',
  description: 'To get user subscription information',
  tags: ['Subscriber'],
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['id', 'email', 'created_at', 'last_notified'],
        example: `['id', 'email', 'created_at', 'last_notified']`
      },
      ...queryStringProps('subscribers')
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const deleteSubscriberSchema = {
  summary: 'Delete Subscription of the user',
  description: 'To Delete Subscription information',
  tags: ['Subscriber'],
  params: {
    type: 'object',
    properties: {
      subscription_id: { type: 'number', description: 'Id of the user subscription' }
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