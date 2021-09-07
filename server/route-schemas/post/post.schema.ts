import { BAD_REQUEST } from 'route-schemas/response';
import { queryStringProps } from './post.properties';

const { limit_fields, with_table } = queryStringProps;

export const createPostSchema = {
  summary: 'Create Post',
  description: 'A POST route to create a post and store its data',
  tags: ['Post'],
  body: {
    type: 'object',
    required: [],
    properties: {
      slug: {
        type: 'string',
        description: 'user should provide slug'
      },
      html: {
        type: 'string',
        description: 'user provided html'
      },
      status: {
        type: 'string',
        description: 'Post status'
      },
      visibilty: {
        type: 'string',
        description: 'Post visibilty'
      },
      featured: {
        type: 'string',
        description: 'Boolean defining whether a post is featured or not'
      },
      banner_image: {
        type: 'string',
        description: 'user provided banner_image'
      },
      type: {
        type: 'string',
        description: 'Post type'
      }
    }
  },
  response: {
    201: {
      description: 'Post created successfully.',
      type: 'object',
      properties: {
        message: {
          type: 'string'
        },
        data: {
          type: 'object',
          properties:{
            id: {
              type: 'string'
            }
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const updatePostSchema = {
  summary: 'Update Post',
  description: 'A PUT route to update data in posts',
  tags: ['Post'],
  params: {
    type: 'object',
    description: 'asdad',
    properties: {
      id: {
        type: 'string',
        description: 'asdasd'
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      html: {
        type: 'string',
        description: 'user provided html'
      },
      status: {
        type: 'string',
        description: 'Post status'
      },
      visibilty: {
        type: 'string',
        description: 'Post visibilty'
      },
      featured: {
        type: 'string',
        description: 'Boolean defining whether a post is featured or not'
      },
      banner_image: {
        type: 'string',
        description: 'user provided banner_image'
      },
      type: {
        type: 'string',
        description: 'Post type'
      },
      updated_at: {
        type: 'string',
        description: 'Latest updated time by the user'
      },
      updated_by: {
        type: 'string',
        description: 'User who had updated it'
      }
    }
  },
  response: {
    201: {
      description: 'Post Updated successfully.',
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

export const getPostSchema = {
  summary: 'Get post',
  description: 'To get post information by id',
  tags: ['Post'],
  queryString: {
    type: 'object',
    properties: {
      limit_fields,
      with_table
    }
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'number', description: 'Id of the post' }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getPostBySlugSchema = {
  summary: 'Get post by slug',
  description: 'To get post information by slug',
  tags: ['Post'],
  queryString: {
    type: 'object',
    properties: {
      limit_fields,
      with_table
    }
  },
  params: {
    type: 'object',
    properties: {
      slug: { type: 'string', description: 'Slug of the post' }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getPostsSchema = {
  summary: 'Get posts',
  description: 'To get post information',
  tags: ['Post'],
  querystring: {
    type: 'object',
    properties: queryStringProps
  },
  response: {
    400: BAD_REQUEST
  }
};

export const deletePostSchema = {
  summary: 'Delete User',
  description: 'To Delete Post information',
  tags: ['Post'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', description: 'Id of the post' }
    }
  },
  response: {
    201: {
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
