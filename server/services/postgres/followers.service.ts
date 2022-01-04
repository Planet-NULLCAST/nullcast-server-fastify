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

    const getCountFollowersQuery: QueryConfig = {
      text: `SELECT COUNT(follower_id)
              FROM ${FOLLOWER_TABLE} AS f
              WHERE f.following_id = $1;`,
      values: [payload.following_id]
    };

    const data = await postgresClient.query<Follow>(getFollowersQuery);
    const count = await postgresClient.query(getCountFollowersQuery);

    return { followers: data.rows as Follow[], ...count.rows[0], limit, page };
  } catch (error) {
    throw error;
  }
}
