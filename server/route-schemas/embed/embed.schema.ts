const embedResponseData = {
  title: {
    type: 'string'
  },
  author_name: {
    type: 'string'
  },
  author_url: {
    type: 'string'
  },
  type: {
    type: 'string'
  },
  height: {
    type: 'integer'
  },
  width: {
    type: 'integer'
  },
  version: {
    type: 'string'
  },
  provider_name: {
    type: 'string'
  },
  provider_url: {
    type: 'string'
  },
  thumbnail_height: {
    type: 'integer'
  },
  thumbnail_width: {
    type: 'integer'
  },
  thumbnail_url: {
    type: 'string'
  },
  html: {
    type: 'string'
  }
};

export const getEmbedSchema = {
  summary: 'Get Embed',
  description: 'To get the embed data from a url',
  tags: ['Embed'],
  required: ['url', 'type'],
  query: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'Url to be embedded'
      },
      type: {
        type: 'string'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: {
          type: 'string'
        },
        data: { type: 'object', properties: { ...embedResponseData } }
      }
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        message: {
          type: 'string'
        }
      }
    }
  }
};
