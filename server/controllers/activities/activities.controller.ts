import { DatabaseHandler } from 'services/postgres/postgres.handler';
import {
  ACTIVITY_TABLE, ACTIVITY_TYPE_TABLE,
  CLASS_TABLE
} from 'constants/tables';
import { Activity } from 'interfaces/activities.type';


const activityHandler = new DatabaseHandler(ACTIVITY_TABLE);
const classHandler = new DatabaseHandler(CLASS_TABLE);
const activityTypeHandler = new DatabaseHandler(ACTIVITY_TYPE_TABLE);

export async function createActivityController(activityData: Activity, userId: number): Promise<Activity> {

  const activityClass = await classHandler.findOneByField(
    { name: activityData.class_name?.toLowerCase() },
    ['id']
  );

  const activityType = await activityTypeHandler.findOneByField(
    { name: activityData.activity_type_name?.toLowerCase() },
    ['id']
  );

  const payload: Activity = {
    user_id: userId,
    name: activityData.name?.toLowerCase() as string,
    class_id: activityClass.id as number,
    activity_type_id: activityType.id as number,
    event_id: activityData.event_id as number,
    post_id: activityData.post_id as number,
    created_by: userId
  };

  const fields = ['id', 'name', 'user_id', 'status', 'created_at'];

  const data = await activityHandler.insertOne(payload, fields);

  return data.rows[0] as Activity;
}

export async function deleteActivityController(activityId: number) : Promise<boolean> {
  try {
    if (!activityId) {
      return false;
    }

    await activityHandler.deleteOneById(activityId);
    return true;
  } catch (error) {
    throw error;
  }
}
