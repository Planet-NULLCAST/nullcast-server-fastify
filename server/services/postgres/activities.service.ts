import { Client, QueryConfig } from 'pg';
import {
  ACTIVITY_TABLE, ACTIVITY_TYPE_TABLE,
  CLASS_TABLE, USER_TABLE
} from 'constants/tables';
import { userActivity } from 'interfaces/activities.type';
import { QueryParams } from 'interfaces/query-params.type';


export async function getYearlyUserActivities(payload: {[x: string]: any}): Promise<userActivity[]> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const getYearlyUserActivitiesQuery: QueryConfig = {
      text: `SELECT DATE(updated_at), COUNT(updated_at)
              FROM ${ACTIVITY_TABLE}
              WHERE updated_at BETWEEN '${payload.year - 1}-01-1' AND '${payload.year}-12-31'
              AND user_id = $1
              GROUP BY date(updated_at)
              ORDER BY date(updated_at) DESC`,
      values: [payload.userId]
    };

    const data = await postgresClient.query(getYearlyUserActivitiesQuery);
    return data.rows as userActivity[];
  } catch (error) {
    throw error;
  }
}

export async function getUserActivityPoints(payload: {[x: string]: any}) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const getUserActivityPointsQuery: QueryConfig = {
      text: `SELECT a.user_id, SUM(at.points) AS points, c.name AS class
              FROM ${ACTIVITY_TABLE} AS a
              LEFT JOIN ${CLASS_TABLE} AS c ON c.id = a.class_id
              LEFT JOIN ${ACTIVITY_TYPE_TABLE} AS at ON at.id = a.activity_type_id
              WHERE a.user_id = $1
              GROUP BY a.user_id, a.class_id, at.points, c.name`,
      values: [payload.userId]
    };

    const data = await postgresClient.query(getUserActivityPointsQuery);
    return data.rows;
  } catch (error) {
    throw error;
  }
}

export async function getLeaderBoard(queryParams: QueryParams) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;
    const {
      page = 1,
      limit = 10
    } = queryParams;

    const getLeaderBoardQuery: QueryConfig = {
      text: `SELECT a.user_id, SUM(a.points) AS total_points, a.user_name, a.full_name, a.avatar,
              JSON_AGG(JSON_BUILD_OBJECT(a.class, a.points)) AS points
              FROM ( SELECT a.user_id, SUM(at.points) AS points, u.user_name, u.full_name, u.avatar, c.name AS class
              FROM ${ACTIVITY_TABLE} AS a
              LEFT JOIN ${ACTIVITY_TYPE_TABLE} AS at ON at.id = a.activity_type_id
              LEFT JOIN ${CLASS_TABLE} AS c ON c.id = a.class_id
              LEFT JOIN ${USER_TABLE} AS u ON u.id = a.user_id
              GROUP BY a.user_id, u.user_name, u.full_name, u.avatar, c.name) a
              GROUP BY a.user_id, a.user_name, a.full_name, a.avatar
              ORDER BY SUM(a.points) DESC
              LIMIT ${+limit}
              OFFSET ${(page - 1) * +limit};`
    };

    const data = await postgresClient.query(getLeaderBoardQuery);
    return data.rows;
  } catch (error) {
    throw error;
  }
}