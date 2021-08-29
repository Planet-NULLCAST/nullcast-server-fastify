export default {
  description: 'Bad request',
  type: 'object',
  requied: ['message'],
  properties: {
    message: {
      type: 'string'
    }
  }
};
