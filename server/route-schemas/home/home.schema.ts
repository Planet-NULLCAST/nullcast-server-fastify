// import { FastifySchema } from "fastify";

export const homeSchema = {
  summary: 'Home Route',
  description: 'To check if home route is working or not',
  tags: ['Home'],
  response: {
    200: {
      description: 'Request Succeeded',
      type: 'object',
      properties: {
        message: { type: 'string', description: 'response message' }
      }
    },
    404: {
      description: 'Not Found',
      type: 'object',
      properties: {
        message: { type: 'string', description: 'response message' }
      }
    }
  }
};

export const docSchema = {
  summary: 'Documentation Route',
  description: 'The ReDoc documentation url for the nullcast fastify APIs',
  tags: ['Home'],
  response: {
    200: {
      description: 'Request Succeeded',
      type: 'object',
      properties: {
        message: {
          type: 'string'
        }
      }
    },
    404: {
      description: 'Not Found',
      type: 'object',
      properties: {
        message: {
          type: 'string'
        }
      }
    }
  }
};

export const healthSchema = {
  summary: 'Health-Check Route',
  description: 'The Health-Check route to check the status of backend',
  tags: ['Home'],
  response: {
    200: {
      description: 'Request Succeeded',
      type: 'object',
      properties: {
        message: {
          type: 'string'
        }
      }
    },
    404: {
      description: 'Not Found',
      type: 'object',
      properties: {
        message: {
          type: 'string'
        }
      }
    }
  }
};
