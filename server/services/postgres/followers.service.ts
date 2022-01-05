import { Client, QueryConfig } from 'pg';
import { FOLLOWER_TABLE, USER_TABLE } from 'constants/tables';
import { Follow } from 'interfaces/followers.type';
import { QueryParams } from 'interfaces/query-params.type';


export async function getFollowers(payload: Follow, queryParams: QueryParams): Promise<Follow[]> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;
    const {
      page = 1,
      limit = 10
    } = queryParams;

    const getFollowersQuery: QueryConfig = {
      text: `SELECT u.id, u.user_name, u.avatar 
              FROM ${FOLLOWER_TABLE} AS f
              JOIN ${USER_TABLE} AS u ON u.id = f.follower_id
              WHERE f.following_id = $1
              LIMIT ${+limit}
              OFFSET ${(page - 1) * +limit};`,
      values: [payload.following_id]
    };

    const getFollowersCountQuery: QueryConfig = {
      text: `SELECT COUNT(follower_id) AS followersCount
              FROM ${FOLLOWER_TABLE} AS f
              WHERE f.following_id = $1;`,
      values: [payload.following_id]
    };

    const getFollowingCountQuery: QueryConfig = {
      text: `SELECT COUNT(following_id) AS followingCount
              FROM ${FOLLOWER_TABLE} AS f
              WHERE f.follower_id = $1;`,
      values: [payload.following_id]
    };

    const data = await postgresClient.query<Follow>(getFollowersQuery);
    const followerCount = await postgresClient.query(getFollowersCountQuery);
    const followingCount = await postgresClient.query(getFollowingCountQuery);

    return { followers: data.rows as Follow[], ...followerCount.rows[0], ...followingCount.rows[0], limit, page };
  } catch (error) {
    throw error;
  }
}

export async function unfollowUser(payload: Follow) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const unfollowUserQuery: QueryConfig = {
      text: `DELETE 
              FROM ${FOLLOWER_TABLE} AS f
              WHERE following_id =$1 AND follower_id = $2;`,
      values: [payload.following_id, payload.follower_id]
    };

    return await postgresClient.query(unfollowUserQuery);
  } catch (error) {
    throw error;
  }
}
