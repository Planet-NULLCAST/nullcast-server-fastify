import { Client, QueryConfig } from 'pg';
import { ValidateUser, ResetPasswordPayload } from 'interfaces/user.type';
import { USER_TABLE } from 'constants/tables';
import { DatabaseHandler } from './postgres.handler';

export async function signInUser(payload: ValidateUser) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const ValidateUserQuery: QueryConfig = {
      name: 'validate-user',
      text: `SELECT id, email, user_name, password, full_name FROM ${USER_TABLE} 
        WHERE (user_name = $1)
        OR (email = $1)`,
      values: [payload.email || payload.user_name]
    };

    const queryData = await postgresClient.query<ValidateUser>(
      ValidateUserQuery
    );

    if (queryData.rows.length) {
      return queryData.rows[0];
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function resetPasswordService(payload: ResetPasswordPayload) {
  try {
    const userHandler = new DatabaseHandler(USER_TABLE);
    const { hashData, email } = payload as ResetPasswordPayload;
    const data = await userHandler.updateBySingleField({password: hashData}, email);
    if (data) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
