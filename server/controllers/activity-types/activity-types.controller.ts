import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { ACTIVITY_TYPE_TABLE, CLASS_TABLE } from 'constants/tables';
import { ActivityType } from 'interfaces/activity-types.type';


const activityTypeHandler = new DatabaseHandler(ACTIVITY_TYPE_TABLE);
const classHandler = new DatabaseHandler(CLASS_TABLE);

export async function createActivityTypeController(
  activityTypeData: ActivityType, userId: number): Promise<ActivityType> {

  const activityClass = await classHandler.findOneByField(
    { name: activityTypeData.class_name?.toLowerCase() },
    ['id']
  );

  const payload: ActivityType = {
    name: activityTypeData.name?.toLowerCase() as string,
    class_id: activityClass.id as number,
    points: activityTypeData.points as number,
    created_by: userId
  };

  const fields = ['id', 'name', 'status', 'points', 'created_at'];

  const data = await activityTypeHandler.insertOne(payload, fields);

  return data.rows[0] as ActivityType;
}

export async function deleteActivityTypeController(activityTypeId: number) : Promise<boolean> {
  try {
    if (!activityTypeId) {
      return false;
    }

    await activityTypeHandler.deleteOneById(activityTypeId);
    return true;
  } catch (error) {
    throw error;
  }
}