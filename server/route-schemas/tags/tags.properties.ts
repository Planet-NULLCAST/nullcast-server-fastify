const basicProps = {
  meta_title: {
    type:'string',
    description: 'The title of the tag as seen in UI'
  },
  description: {
    type: 'string',
    description: 'A short description about the tag'
  },
  meta_description: {
    type: 'string',
    description: 'The description provided in meta tag'
  },
  feature_image: {
    type: 'string',
    format: 'uri',
    description: 'A url for the image representing the tag'
  },
  visibility: {
    type: 'string',
    enum: ['public', 'private'],
    description: 'The visibility status of a tag. Default is `public` '
  },
  status: {
    type: 'string',
    enum: ['active', 'inactive'],
    description: 'Current usage status of the tag. Default is `active`'
  }
};

export const createTagProps = {
  name: {
    type: 'string',
    minLength: 1,
    maxLength: 20,
    pattern: '^[a-z_A-Z 0-9]+$',
    description: 'Name of the tag that follows the expression `/^[a-z_A-Z 0-9]+$/`'
  },
  ...basicProps
};

export const updateTagProps = {
  ...basicProps
};
