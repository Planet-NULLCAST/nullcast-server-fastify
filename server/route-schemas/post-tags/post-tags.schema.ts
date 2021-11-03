import { BAD_REQUEST } from 'route-schemas/response';
import { queryStringProps } from 'route-schemas/shared-schemas/shared.properties';


export const createPostTagSchema = {
  summary: 'Add Tag for a post',
  description: 'A POST route to add postTag information',
  tags: ['Post_tag'],
  body:  {
    type: 'object',
    required: ['tag_id', 'post_id'],
    properties: {
      tag_id: {
        type: 'number',
        description: 'Id of the Tag'
      },
      post_id: {
        type: 'number',
        description: 'Id of the Post'
      }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getPostsByTagIdSchema = {
  summary: 'Get Posts by tagId',
  description: 'To get postTag information',
  tags: ['Post_tag'],
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['id', 'html', 'slug', 'created_by', 'status',
          'mobiledoc', 'created_at', 'published_at', 'banner_image', 'title', 'meta_title'],
        example: `['id', 'created_at', 'created_by', 'status']`
      },
      ...queryStringProps('post')
    }
  },
  params: {
    type: 'object',
    properties: {
      tag_id: { type: 'number', description: 'Id of the tag' }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getTagsByPostIdSchema = {
  summary: 'Get Tags by postId',
  description: 'To get postTag information',
  tags: ['Post_tag'],
  querystring: {
    type: 'object',
    properties: {
      limit_fields: {
        type: 'array',
        description: 'The fields that are needed to be returned',
        default: ['id', 'name', 'created_by', 'created_at'],
        example: `['id', 'name', 'created_by', 'created_at']`
      },
      ...queryStringProps('tags')
    }
  },
  params: {
    type: 'object',
    properties: {
      post_id: { type: 'number', description: 'Id of the post' }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const deletePostTagSchema = {
  summary: 'Delete Post Tag',
  description: 'To Delete postTag information',
  tags: ['Post_tag'],
  params: {
    type: 'object',
    properties: {
      tag_id: { type: 'number', description: 'Id of tag' },
      post_id: { type: 'number', description: 'Id of post' }
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
