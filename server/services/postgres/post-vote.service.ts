import { Client, QueryConfig } from 'pg';
import { POST_VOTE_TABLE } from 'constants/tables';
import { PostVote } from 'interfaces/post-vote.type';


export async function addPostVote(payload: PostVote) {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const addPostVoteQuery: QueryConfig = {
    text: `INSERT INTO ${POST_VOTE_TABLE} 
            (post_id, user_id, value) 
            VALUES($1, $2, $3) 
            ON CONFLICT (post_id, user_id) 
            DO UPDATE SET VALUE = EXCLUDED.VALUE
            RETURNING post_id, user_id, value;`,
    values: [payload.postId, payload.userId, payload.value]
  };

  const data = await postgresClient.query(addPostVoteQuery);
  if (data.rows && data.rows.length) {
    return data.rows[0] as PostVote;
  }
  throw {statusCode: 404, message: 'Vote not added to this post'};
}

export async function getPostVotes(payload: {postId: number}) {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getPostVoteQuery: QueryConfig = {
    text: `SELECT count(CASE WHEN value = 1 THEN 1 END) AS upvotes,
            count(CASE WHEN value = -1 THEN 1 END) AS downvotes,
            COALESCE(JSONB_AGG(user_id) 
            FILTER (WHERE user_id IS NOT NULL), '[]') AS votes
            FROM ${POST_VOTE_TABLE}
            WHERE post_id = $1;`,
    values: [payload.postId]
  };

  const postVoteData = await postgresClient.query(getPostVoteQuery);
  if (postVoteData.rows && postVoteData.rows.length) {
    return postVoteData.rows[0];
  }
  throw {statusCode: 404, message: 'No votes found for this post'};
}

export async function getPostVoteByUser(payload: {postId: number, userId: number}) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const userPostVoteQuery: QueryConfig = {
    text: `SELECT
              CASE
                WHEN value = 1 THEN 'up'
                WHEN value = -1 THEN 'down'
              END as vote_kind
            FROM ${POST_VOTE_TABLE}
            WHERE post_id = $1 AND user_id = $2;`,
    values: [payload.postId, payload.userId]
  };
  const userVoteData = await postgresClient.query(userPostVoteQuery);
  if (userVoteData.rows && userVoteData.rows.length) {
    return userVoteData.rows[0];
  }
  throw {statusCode: 200, message: 'User has not voted for this post'};
  } catch(err) {
    throw(err);
  }
}

export async function deletePostVote(payload: {postId: number, userId: number}) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const deletePostTagQuery: QueryConfig = {
      text: `DELETE FROM ${POST_VOTE_TABLE}
              WHERE user_id = $1 AND post_id = $2;`,
      values: [payload.userId, payload.postId]
    };
    return await postgresClient.query(deletePostTagQuery);
  } catch (err) {
    throw err;
  }
}
