import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { CLASS_TABLE } from 'constants/tables';
import { Class } from 'interfaces/classes.type';


const classHandler = new DatabaseHandler(CLASS_TABLE);

export async function createClassController(classData: Class): Promise<Class> {

  const payload: Class = {
    ...classData,
    name: classData.name.toLowerCase() as string,
    description: classData.description as string
  };

  const fields = ['id', 'name', 'description', 'created_at'];

  const data = await classHandler.insertOne(payload, fields);

  return data.rows[0] as Class;
}

export async function deleteClassController(className: string) : Promise<boolean> {
  try {
    const { id } = await classHandler.findOneByField(
      { name: className },
      ['id']
    );
    if (!id) {
      return false;
    }

    await classHandler.deleteOneById(id);
    return true;
  } catch (error) {
    throw error;
  }
}
