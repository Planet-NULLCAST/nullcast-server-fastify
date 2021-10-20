import { BAD_REQUEST } from 'route-schemas/response';
import { postProps } from './post.properties';
import { queryStringProps } from 'route-schemas/shared-schemas/shared.properties';


export const createPostSchema = {
  summary: 'Create Post',
  description: 'A POST route to create a post and store its data',
  tags: ['Post'],
  body: {
    type: 'object',
    required: ['html'],
    properties: {
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
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['id', 'slug', 'created_by', 'html', 'mobiledoc', 'created_at',
          'published_at', 'banner_image', 'title', 'meta_title'],
        example: `['id', 'slug', 'created_by']`
      },
      ...queryStringProps('post')
    }
  },
  params: {
    type: 'object',
    properties: {
      postId: { type: 'number', description: 'Id of the post' }
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
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['id', 'slug', 'created_by', 'html', 'mobiledoc', 'created_at',
          'published_at', 'banner_image', 'title', 'meta_title'],
        example: `['id', 'slug', 'created_by']`
      },
      ...queryStringProps('post')
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
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['id', 'slug', 'created_by', 'html', 'mobiledoc', 'created_at',
          'published_at', 'banner_image', 'title', 'meta_title'],
        example: `['id', 'slug', 'created_by']`
      },
      ...queryStringProps('post')
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getPostsByTagSchema = {
  summary: 'Get posts by tagname',
  description: 'To get post information',
  tags: ['Post'],
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['slug', 'created_by', 'mobiledoc', 'created_at', 'published_at',
          'banner_image', 'title', 'meta_title'],
        example: `['slug', 'created_by', 'mobiledoc']`
      },
      ...queryStringProps('post')
    }
  },
  params: {
    type: 'object',
    properties: {
      tagName: { type: 'string', description: 'tag of the post' }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getPostsByUserIdSchema = {
  summary: 'Get posts by userId',
  description: 'To get post information',
  tags: ['Post'],
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['slug', 'created_by', 'mobiledoc', 'created_at', 'published_at',
          'banner_image', 'title', 'meta_title'],
        example: `['slug', 'created_by', 'mobiledoc']`
      },
      ...queryStringProps('post')
    }
  },
  params: {
    type: 'object',
    properties: {
      userId: { type: 'number', description: 'Id of the user whom have created the post' }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const deletePostSchema = {
  summary: 'Delete Post',
  description: 'To Delete Post information',
  tags: ['Post'],
  params: {
    type: 'object',
    properties: {
      postId: { type: 'string', description: 'Id of the post' }
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
