import { Client, QueryConfig } from 'pg';
import {
  ACTIVITY_TABLE, ACTIVITY_TYPE_TABLE,
  CLASS_TABLE, HISTORICAL_POINT_TABLE, USER_TABLE
} from 'constants/tables';
import { userActivity } from 'interfaces/activities.type';
import { QueryParams } from 'interfaces/query-params.type';


export async function getYearlyUserActivities(payload: {[x: string]: any}): Promise<userActivity[]> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const getYearlyUserActivitiesQuery: QueryConfig = {
      text: `SELECT DATE(updated_at), COUNT(updated_at)
              FROM ${ACTIVITY_TABLE}
              WHERE updated_at BETWEEN '${payload.year}-01-1' AND '${payload.year}-12-31'
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
      text: `SELECT hp.user_id, c.name AS class,
            (SELECT hp.points + COALESCE(SUM(at.points), 0)
              FROM ${ACTIVITY_TABLE} AS a
              LEFT JOIN ${ACTIVITY_TYPE_TABLE} AS at ON at.id = a.activity_type_id
              LEFT JOIN ${CLASS_TABLE} AS cl ON cl.id = a.class_id
              WHERE 
                cl.id = hp.class_id 
                AND a.user_id = hp.user_id 
                AND a.created_at >= hp.last_checked_activity_timestamp
                AND a.id != hp.last_activity_id
            ) AS points
            FROM ${HISTORICAL_POINT_TABLE} AS hp
            LEFT JOIN ${CLASS_TABLE} AS c ON c.id = hp.class_id
            WHERE hp.user_id = $1
            GROUP BY hp.user_id, hp.points, hp.class_id,
            hp.last_checked_activity_timestamp, hp.last_activity_id, c.name`,
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

    const getLeaderBoardCountQuery: QueryConfig = {
      text: `SELECT COUNT(DISTINCT a.user_id) AS count
              FROM ${ACTIVITY_TABLE} AS a;`
    };

    const data = await postgresClient.query(getLeaderBoardQuery);
    const countData = await postgresClient.query(getLeaderBoardCountQuery);

    return {users: data.rows, ...countData?.rows[0], limit, page};
  } catch (error) {
    throw error;
  }
}


export async function getLeaderBoards(queryParams: QueryParams) {
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

    const getLeaderBoardCountQuery: QueryConfig = {
      text: `SELECT COUNT(DISTINCT a.user_id) AS count
              FROM ${ACTIVITY_TABLE} AS a;`
    };

    const data = await postgresClient.query(getLeaderBoardQuery);
    const countData = await postgresClient.query(getLeaderBoardCountQuery);

    return {users: data.rows, ...countData?.rows[0], limit, page};
  } catch (error) {
    throw error;
  }
}
