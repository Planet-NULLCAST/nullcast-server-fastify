export const userProps = {
  user_name: {
    type: 'string',
    description: 'user provided username'
  },
  full_name: {
    type: 'string',
    description: 'user provided full name'
  },
  email: {
    type: 'string',
    description: 'user email'
  },
  cover_image: {
    type: 'string',
    default: null,
    description: 'cover image s3 url'
  },
  bio: {
    type: 'string',
    description: 'Bio of the user'
  },
  discord: {
    type: 'string',
    default: null,
    description: 'discord of the user'
  },
  facebook: {
    type: 'string',
    default: null,
    description: 'facebook of the user'
  },
  twitter: {
    type: 'string',
    default: null,
    description: 'twitter of the user'
  },
  linkedin: {
    type: 'string',
    default: null,
    description: 'twitter of the user'
  },
  meta_description: {
    type: 'string',
    default: null,
    description: 'meta_description of the user'
  },
  meta_title: {
    type: 'string',
    default: null,
    description: 'meta_title of the user'
  },
  dob: {
    type: 'string',
    description: 'dob of the user'
  },
  avatar: {
    type: 'string',
    default: null,
    description: 'avatar of the user'
  }
};
