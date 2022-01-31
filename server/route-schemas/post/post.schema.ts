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
          'published_at', 'banner_image', 'featured', 'title', 'meta_title', 'updated_at'],
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
          'published_at', 'banner_image', 'featured', 'title', 'meta_title', 'updated_at'],
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
        default: ['id', 'slug', 'created_by', 'html', 'status', 'mobiledoc',
          'created_at', 'published_at', 'banner_image', 'featured', 'title', 'meta_title', 'updated_at'],
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
        default: ['slug', 'created_by', 'status', 'mobiledoc', 'created_at',
          'published_at', 'banner_image', 'featured', 'title', 'meta_title'],
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
  params: {
    type: 'object',
    properties: {
      user_id: { type: 'number', description: 'Id of the user' }
    }
  },
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['slug', 'created_by', 'status', 'mobiledoc', 'created_at',
          'published_at', 'banner_image', 'featured', 'title', 'meta_title', 'updated_at'],
        example: `['slug', 'created_by', 'mobiledoc']`
      },
      tag: {
        type: 'string',
        description: 'Tag of the post'
      },
      ...queryStringProps('post')
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getPostsCountSchema = {
  summary: 'Get posts count by userId',
  description: 'To get posts count information',
  tags: ['Post'],
  querystring: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        default: '',
        enum: ['', 'drafted', 'pending', 'published', 'rejected'],
        description: `Status of the post data`
      }
    }
  },
  response: {
    200: {
      message: {
        type: 'string'
      },
      data: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'Number of posts'
          }
        }
      }
    },
    400: BAD_REQUEST
  }
};

export const getAllPostUrlSchema = {
  summary: 'Get all posts slug',
  description: 'To get all posts slug information',
  tags: ['Post'],
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
            slug: { type: 'string', description: 'Url of the post'}
          }
        }
      }
    },
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
