import { createTagProps, updateTagProps } from './tags.properties';

export const createTagSchema = {
  summary: 'Create a tag ',
  description: 'Create a tag that is associated with a blog post',
  tags: ['Tags'],
  body: {
    type: 'object',
    required: ['name', 'meta_title'],
    properties: createTagProps,
    additionalProperties: false
  }
};

export const getTagSchema = {
  summary: 'Get a tag',
  description: 'Gets all the information of the provided tag name',
  tags: ['Tags'],
  params: {
    type: 'object',
    required: ['tag_name'],
    properties: {
      tag_name: {
        type: 'string',
        description: 'Tag name'
      }
    },
    additionalProperties: false
  }
};

export const updateTagSchema = {
  summary: 'Update a tag',
  description: 'Update a particular tag',
  tags: ['Tags'],
  params: {
    type: 'object',
    required: ['tag_name'],
    properties: {
      tag_name: {
        type: 'string',
        description: 'Tag name'
      }
    },
    additionalProperties: false
  },
  body: {
    type: 'object',
    properties: updateTagProps
  }
};

export const getTagsSchema = {
  summary: 'Get tags',
  description: 'Get a list of available tags',
  tags: ['Tags'],
  querystring: {
    type: 'object',
    properties: {
      search: {
        type: 'string',
        description: 'A seach field based on tag name'
      },
      page: {
        type: 'number',
        minimum: 1,
        description: 'The page number representing pagination'
      },
      limit: {
        type: 'number',
        minimum: 25,
        maximum: 100,
        description: 'To limit the data per page'
      },
      order: {
        type: 'string',
        enum: ['ASC', 'DESC'],
        description: 'To order the response data in either ascending or descending'
      },
      sort_field: {
        type: 'string',
        enum: ['id', 'name', 'description', 'meta_title', 'meta_description', 'created_at', 'updated_at'],
        description: 'Which will be field to be to considered while arranging the response. Default is `name`'
      },
      limit_fields: {
        type:  'array',
        // enum: ['id', 'name', 'description', 'meta_title', 'meta_description', 'feature_image', 'slug', 'status', 'created_at', 'updated_at', 'created_by', 'visibility', 'updated_by'],
        uniqueItems: true,
        minItems: 1,
        maxItems: 15,
        items: {
          type: 'string',
          enum: ['id', 'name', 'description', 'meta_title', 'meta_description', 'feature_image', 'slug', 'status', 'created_at', 'updated_at', 'created_by', 'visibility', 'updated_by']
        },
        description: 'Which all are the fields available from this endpoint'
      }
    },
    additionalProperties: false
  }
};
