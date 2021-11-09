import { BAD_REQUEST } from 'route-schemas/response';


export const checkAdminSchema = {
  summary: 'Check Admin',
  description: 'Route to check if the user has admin access',
  tags: ['Admin'],
  response: {
    400: BAD_REQUEST
  }
};

export const adminReviewPostSchema = {
  summary: 'Admin post review',
  description: 'Route to review post by admin',
  tags: ['Admin'],
  params: {
    type: 'object',
    properties: {
      post_id: {
        type: 'number',
        description: 'Id of the post'
      }
    }
  },
  respone: {
    400: BAD_REQUEST
  }
};
