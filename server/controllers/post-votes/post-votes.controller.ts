import { POST_VOTE_TABLE } from 'constants/tables';
import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { TokenUser } from 'interfaces/user.type';
import { PostVote } from 'interfaces/post-vote.type';


const postVoteHandler = new DatabaseHandler(POST_VOTE_TABLE);

export async function addPostVoteController(postVoteData: PostVote, postId: number, user:TokenUser): Promise<PostVote> {
  try {
    const payload: PostVote = {
      postId: postId as number,
      userId: user.id as number,
      value: postVoteData.value as number
    };
  
    return await postVoteHandler.dbHandler('ADD_POST_VOTE', payload) as PostVote;
  } catch (error) {
    throw error;
  }
}

export async function getPostVoteController(postId: number) {
  try {
    const payload = {
      postId: postId
    };

    return await postVoteHandler.dbHandler('GET_POST_VOTES', payload);

  } catch (error) {
    throw error;
  }
}

export async function getPostVoteByUserController(postId: number, user:TokenUser) {
  try {
    const payload = {
      userId: user.id,
      postId: postId
    };

    return await postVoteHandler.dbHandler('GET_POST_VOTE_BY_USER', payload);

  } catch (error) {
    throw error;
  }
}

export async function deletePostVoteController(postId: number, userId: number) : Promise<boolean> {
  try {
    if (!postId) {
      return false;
    }

    const payload = {
      'postId': postId,
      'userId': userId
    };

    await postVoteHandler.dbHandler('DELETE_POST_VOTE', payload);
    return true;
  } catch (error) {
    throw error;
  }
}
