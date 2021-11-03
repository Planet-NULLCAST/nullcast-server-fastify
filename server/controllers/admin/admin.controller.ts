import { USER_ROLE_TABLE } from 'constants/tables';
import { DatabaseHandler } from 'services/postgres/postgres.handler';


const userRoleHandler = new DatabaseHandler(USER_ROLE_TABLE);

export async function checkAdminController(userId: number): Promise<boolean> {
  try {
    const payload = {
      'userId': userId
    };

    return await userRoleHandler.dbHandler('CHECK_ADMIN', payload) as boolean;
  } catch (error) {
    throw error;
  }
}
