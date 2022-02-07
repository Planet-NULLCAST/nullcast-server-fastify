import { Client, QueryConfig } from 'pg';
import initServices from '../../server/initialize-services';
import { bulkWrite } from '../../server/services/postgres/query-builder.service';
import * as tableNames from '../../server/constants/tables';
import { HistoricalPoints } from '../../server/interfaces/historical-points.type';


export async function addHistoricalPoints() {
  // Connect to postgres db
  await initServices();
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    // Query to fetch all recorded activity points from historical points table
    const getLastRecordedActivity: QueryConfig = {
      text: `SELECT user_id, class_id, last_activity_id, last_checked_activity_timestamp
              FROM ${tableNames.HISTORICAL_POINT_TABLE}
              ORDER BY last_checked_activity_timestamp DESC;`
    };
    const historicalPoints = (await postgresClient.query(getLastRecordedActivity)).rows;

    // Details of latest added activity to historical points table
    const {last_checked_activity_timestamp,
      last_activity_id } = historicalPoints.length && historicalPoints[0];

    // Query to get all activities added after the latest recorded activity in the hitsorical points table
    const getActivityPoints: QueryConfig = {
      text: `SELECT a.user_id, SUM(at.points) AS points, a.class_id,
              MAX(a.created_at) AS last_checked_activity_timestamp,
              (SELECT id FROM ${tableNames.ACTIVITY_TABLE} 
                WHERE created_at = MAX(a.created_at) AND class_id = a.class_id AND
                user_id = a.user_id) AS last_activity_id
              FROM ${tableNames.ACTIVITY_TABLE} AS a
              LEFT JOIN ${tableNames.ACTIVITY_TYPE_TABLE} AS at ON at.id = a.activity_type_id
              ${historicalPoints.length ?
    `WHERE a.created_at >= '${last_checked_activity_timestamp.toISOString()}' AND a.id != ${last_activity_id}`: ''}
              GROUP BY a.user_id, a.class_id;`
    };
    const activityPoints = (await postgresClient.query(getActivityPoints)).rows;

    // Condition to check to add or update data if new activities are added
    if (activityPoints.length) {

      // Function to get two array differnces with custom conditions
      const comparator = function(a: any, b: any) {
        return a.user_id === b.user_id && a.class_id === b.class_id;
      };
      // New user activities whose previous data is not recorded in the historical points table
      const newActivities = activityPoints.filter((x) => !historicalPoints.some(
        (y) => comparator(x, y))) as HistoricalPoints[];
      // Conndition to check whether to write new activities if any is present
      if (newActivities.length) {
        await bulkWrite(tableNames.HISTORICAL_POINT_TABLE, newActivities);
      }

      // Activities whose previous points are recorded and new points are to be updated
      const activitiesToBeUpdated = historicalPoints.filter((x) => activityPoints.some(
        (y) => comparator(x, y)));
      // Condition to update historical points table if there is any activities to be updated
      if (activitiesToBeUpdated.length) {
        // use for of
        for (const hp of activitiesToBeUpdated) {
          const updated_at = new Date().toISOString();
          // Query to update activity points to historical points table whose old activities are already recorded
          const updateActivityPoints: QueryConfig = {
            text: `UPDATE ${tableNames.HISTORICAL_POINT_TABLE} AS hp SET points = hp.points+a.points,
                    last_checked_activity_timestamp = a.last_checked_activity_timestamp,
                    last_activity_id = a.last_activity_id,
                    updated_at = '${updated_at}'
                    FROM (SELECT a.user_id, SUM(at.points) AS points, a.class_id,
                    MAX(a.created_at) AS last_checked_activity_timestamp,
                      (SELECT id FROM ${tableNames.ACTIVITY_TABLE} 
                        WHERE created_at = MAX(a.created_at) AND class_id = a.class_id
                        AND user_id = a.user_id) AS last_activity_id
                      FROM ${tableNames.ACTIVITY_TABLE} AS a
                      LEFT JOIN ${tableNames.ACTIVITY_TYPE_TABLE} AS at ON at.id = a.activity_type_id
                      WHERE
                        a.id != ${hp.last_activity_id} 
                        AND a.created_at >= '${hp.last_checked_activity_timestamp.toISOString()}'
                        AND a.user_id = ${hp.user_id}
                        AND a.class_id = ${hp.class_id}
                      GROUP BY a.user_id, a.class_id
                    ) AS a
                    WHERE hp.user_id = ${hp.user_id} AND hp.class_id = ${hp.class_id}
                    RETURNING hp.user_id, hp.points;`
          };
          await postgresClient.query(updateActivityPoints);
        }
      }
      throw ('User activities recorded successfully');
    }
    throw ('No new user activities found to be recorded');
  } catch (error) {
    console.error(error);
  }
}
