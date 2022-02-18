import { Client, QueryConfig } from 'pg';
import { findOneByField } from './query-builder.service';
import {
  ACTIVITY_TABLE, ACTIVITY_TYPE_TABLE,
  POST_TABLE, POST_VOTE_TABLE
} from 'constants/tables';
import { PostVote } from 'interfaces/post-vote.type';
import { Activity } from 'interfaces/activities.type';


export async function addPostVote(payload: [PostVote, Activity]) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    // Insert Query for activity table
    const columns: string = Object.keys(payload[1]).join(', ');
    const values: string[] = Object.values(payload[1]);
    const valueRefs: string = values
    /* eslint-disable @typescript-eslint/no-unused-vars */
    /* eslint-disable no-unused-vars */
      .map((value, _) => `'${value}'`)
      .join(', ');

    // Update Query oro activity table
    let updateStatement = 'SET';
    const activityArray = Object.entries(payload[1]);

    const queryValues: any[]= [];

    activityArray.forEach(([key, value], index) => {
      queryValues.push(value);
      if (index !== activityArray.length - 1) {
        updateStatement = `${updateStatement} ${key} = '${queryValues[index]}',`;
      } else {
        updateStatement = `${updateStatement} ${key} = '${queryValues[index]}'`;
      }
    });

    const activityName = payload[0]. value > 0 ? 'post_downvote' : 'post_upvote';
    const activity = await findOneByField(
      ACTIVITY_TYPE_TABLE,
      { name: activityName },
      ['id']
    );

    const findActivityQuery: QueryConfig = {
      text: `SELECT activity_type_id
              FROM ${ACTIVITY_TABLE} AS a
              WHERE a.post_id = ${payload[0].postId} AND
              a.created_by = ${payload[0].userId} AND
              a.activity_type_id IN(${activity.id}, ${payload[1].activity_type_id})`
    };
    let activityType = (await postgresClient.query(findActivityQuery.text)).rows[0];
    if (activityType && activityType.activity_type_id === activity.id) {
      activityType = true;
    } else {
      activityType = false;
    }


    const addPostVoteQuery: QueryConfig = {
      text: `BEGIN;
              INSERT INTO ${POST_VOTE_TABLE} 
              (post_id, user_id, value) 
              VALUES(${payload[0].postId}, ${payload[0].userId}, ${payload[0].value}) 
              ON CONFLICT (post_id, user_id) 
              DO UPDATE SET VALUE = EXCLUDED.VALUE;
              
              ${activityType ?
    `UPDATE ${ACTIVITY_TABLE}
                ${updateStatement}
                WHERE post_id = ${payload[0].postId} AND
                created_by = ${payload[0].userId} AND
                activity_type_id IN(${activity.id}, ${payload[1].activity_type_id});`
    :
    `INSERT INTO
                ${ACTIVITY_TABLE}
                (${columns}, user_id, created_by)
                SELECT ${valueRefs}, created_by, ${payload[0].userId}
                FROM ${POST_TABLE} WHERE id = ${payload[0].postId}
                ON CONFLICT (post_id, user_id, activity_type_id, created_by) 
                DO NOTHING;`
}
            COMMIT;`
    };
    await postgresClient.query(addPostVoteQuery.text);
    return true;
  } catch (error) {
    throw error;
  }
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
    return null;

  } catch (err) {
    throw (err);
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
