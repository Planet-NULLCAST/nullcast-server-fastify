import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { findActivityType } from 'utils/activities.utils';
import { POST_VOTE_TABLE } from 'constants/tables';
import { TokenUser } from 'interfaces/user.type';
import { PostVote } from 'interfaces/post-vote.type';
import { Activity } from 'interfaces/activities.type';


const postVoteHandler = new DatabaseHandler(POST_VOTE_TABLE);

export async function addPostVoteController(postVoteData: PostVote, postId: number, user:TokenUser): Promise<boolean> {
  try {
    const postVote: PostVote = {
      postId: postId as number,
      userId: user.id as number,
      value: postVoteData.value as number
    };

    // activity data
    let activity;
    if (postVoteData.value > 0) {
      activity = await findActivityType('post_upvote') as Activity;
    } else {
      activity = await findActivityType('post_downvote') as Activity;
    }
    activity.post_id = postId;

    const payload = [postVote, activity];

    return await postVoteHandler.dbHandler('ADD_POST_VOTE', payload) as boolean;
  } catch (error) {
    throw error;
  }
}

export async function getPostVoteController(postId: number) {
  try {
    const payload = {
      postId
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
      postId
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
