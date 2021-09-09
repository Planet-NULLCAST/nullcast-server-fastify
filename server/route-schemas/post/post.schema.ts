import { BAD_REQUEST } from 'route-schemas/response';
import { queryStringProps, postProps } from './post.properties';

const { limit_fields, with_table } = queryStringProps;

export const createPostSchema = {
  summary: 'Create Post',
  description: 'A POST route to create a post and store its data',
  tags: ['Post'],
  body: {
    type: 'object',
    required: [],
    properties: {
      created_at: {
        type: 'string',
        description: 'time at which user creates the post'
      },
      created_by: {
        type: 'number',
        description: 'user who creates it'
      },
      ...postProps
    }
  },
  response: {
    // 201: {
    //   description: 'Post created successfully.',
    //   type: 'object',
    //   properties: {
    //     message: {
    //       type: 'string'
    //     },
    //     data: {
    //       type: 'object',
    //       properties:{
    //         id: {
    //           type: 'string'
    //         }
    //       }
    //     }
    //   }
    // },
    400: BAD_REQUEST
  }
};

export const updatePostSchema = {
  summary: 'Update Post',
  description: 'A PUT route to update data in posts',
  tags: ['Post'],
  params: {
    type: 'object',
    properties: {
      postId: {
        type: 'number',
        description: 'id of the post'
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      updated_at: {
        type: 'string',
        description: 'Latest updated time by the user'
      },
      updated_by: {
        type: 'number',
        description: 'User who had updated it'
      },
      ...postProps
    }
  },
  response: {
    // 200: {
    //   description: 'Post Updated successfully.',
    //   type: 'object',
    //   properties: {
    //     message: {
    //       type: 'string'
    //     }
    //   }
    // },
    400: BAD_REQUEST
  }
};

export const getPostSchema = {
  summary: 'Get post',
  description: 'To get post information by id',
  tags: ['Post'],
  queryString: {
    type: 'object',
    required: [
      limit_fields,
      with_table
    ],
    properties: queryStringProps
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
    required: [
      limit_fields,
      with_table
    ],
    properties: queryStringProps
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
    properties: {
      postId: { type: 'number', description: 'Id of the post' }
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
