import { findOneByField } from 'services/postgres/query-builder.service';
import { Activity } from 'interfaces/activities.type';
import {
  ACTIVITY_TYPE_TABLE
} from 'constants/tables';


export async function findActivityType(activityType: string) {
  const {name, class_id, id} = await findOneByField(
    ACTIVITY_TYPE_TABLE,
    { name: activityType },
    ['name', 'class_id', 'id']
  );
  const activity : Activity = {
    name: name,
    class_id,
    activity_type_id: id
  }
  return activity as Activity;
}