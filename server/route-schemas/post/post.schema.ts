
export const createPostSchema = {
  summary: 'Create Post',
  description: 'A POST route to create a post and store its data',
  tags: ['Post'],
  body:  {
    type: 'object',
    required: ['slug', 'primary_tag'],
    properties: {
      slug: {
        type: 'string',
        description: 'user should provide slug'
      },
      primary_tag: {
        type: 'string',
        description: 'user should provide primary tag'
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
      },
      updated_at: {
        type: 'string',
        description: 'Latest updated time by the user'
      },
      updated_by: {
        type: 'string',
        description: 'User who had updated it'
      },
      published_at: {
        type: 'string',
        description: 'The published time'
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
        }
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

export const updatePostSchema = {
  summary: 'Update Post',
  description: 'A PUT route to update data in posts',
  tags: ['Post'],
  params: {
    type: 'object'
  },
  body:  {
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

export const getPostSchema = {
  summary: 'Get User',
  description: 'To get post information',
  tags: ['Post'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'number', description: 'Id of the post' }
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
