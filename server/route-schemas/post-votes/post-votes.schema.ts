import { BAD_REQUEST } from 'route-schemas/response';


export const addPostVoteSchema = {
  summary: 'Add vote for a post',
  description: 'A POST route to add postVote information',
  tags: ['Post_vote'],
  params: {
    type: 'object',
    properties: {
      post_id: { type: 'number', description: 'Id of post' }
    }
  },
  body:  {
    type: 'object',
    required: ['value'],
    properties: {
      value: {
        type: 'number',
        enum: [1, -1],
        description: 'Value determining upvote or downvote'
      }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getPostVotesSchema = {
  summary: 'Get postVotes by post_id',
  description: 'To get information of votes regarding a post',
  tags: ['Post_vote'],
  params: {
    type: 'object',
    properties: {
      post_id: { type: 'number', description: 'Id of post' }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const getPostVoteByUserSchema = {
  summary: 'Get postVotes by post_id',
  description: 'To get information of vote regarding a post done by that user',
  tags: ['Post_vote'],
  params: {
    type: 'object',
    properties: {
      post_id: { type: 'number', description: 'Id of post' }
    }
  },
  response: {
    400: BAD_REQUEST
  }
};

export const deletePostVoteSchema = {
  summary: 'Delete Post Vote',
  description: 'To Delete postTag information',
  tags: ['Post_vote'],
  params: {
    type: 'object',
    properties: {
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
