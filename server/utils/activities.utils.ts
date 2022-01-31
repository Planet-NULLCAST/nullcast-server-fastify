import { findOneByField } from '../../server/services/postgres/query-builder.service';
import { Activity } from '../../server/interfaces/activities.type';
import {ACTIVITY_TYPE_TABLE} from '../../server/constants/tables';


export async function findActivityType(activityType: string) {
  const {name, class_id, id} = await findOneByField(
    ACTIVITY_TYPE_TABLE,
    { name: activityType },
    ['name', 'class_id', 'id']
  );
  const activity : Activity = {
    name,
    class_id,
    activity_type_id: id
  };
  return activity as Activity;
}
