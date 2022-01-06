import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { FOLLOWER_TABLE } from 'constants/tables';
import { Follow } from 'interfaces/followers.type';
import { QueryParams } from 'interfaces/query-params.type';


const followerHandler = new DatabaseHandler(FOLLOWER_TABLE);

export async function addFollowerController(data: Follow, followerId: number) {
  try {
    const payload: Follow = {
      follower_id: followerId,
      following_id: data.following_id,
      created_by: data.following_id
    };
    const fields = ['follower_id', 'following_id', 'created_by', 'updated_by'];
    const response = await followerHandler.insertOne(payload, fields);
    return response.rows[0] as Follow;
  } catch (error) {
    throw error;
  }
}
export async function getFollowerController(followingId: number, followerId: number) {
  try {
    const payload: Follow = {
      following_id: followingId,
      follower_id: followerId
    };
    return await followerHandler.dbHandler('GET_FOLLOWER', payload);
  } catch (error) {
    throw error;
  }
}

export async function getFollowersController(followingId: number, queryParams: QueryParams) {
  try {
    const payload: Follow = {
      following_id: followingId
    };
    return await followerHandler.dbHandler('GET_FOLLOWERS', payload, queryParams);
  } catch (error) {
    throw error;
  }
}

export async function removeFollowerController(followingId: number, followerId: number) {
  try {
    const payload: Follow = {
      following_id: followingId,
      follower_id: followerId
    };
    return await followerHandler.dbHandler('UNFOLLOW_USER', payload);
  } catch (error) {
    throw error;
  }
}
