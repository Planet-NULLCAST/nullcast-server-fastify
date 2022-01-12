import { Client, QueryConfig } from 'pg';
import { ACTIVITY_TABLE } from 'constants/tables';
import { userActivity } from 'interfaces/activities.type';

export async function getUserActivities(payload: {[x: string]: any}): Promise<userActivity[]> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const getChapterQuery: QueryConfig = {
      text: `SELECT DATE(updated_at), COUNT(updated_at)
              FROM ${ACTIVITY_TABLE}
              WHERE updated_at BETWEEN '${payload.year - 1}-01-1' AND '${payload.year}-12-31'
              AND user_id = $1
              GROUP BY date(updated_at)
              ORDER BY date(updated_at) DESC`,
      values: [payload.userId]
    };

    const data = await postgresClient.query(getChapterQuery);
    return data.rows as userActivity[];
  } catch(error) {
    throw error;
  }
}
