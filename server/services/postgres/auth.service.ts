import { Client, QueryConfig } from "pg";
import { ValidateUser } from "interfaces/user.type";

export async function signInUser(payload: ValidateUser) {
    try {
      const postgresClient: Client = (globalThis as any).postgresClient as Client;
  
      const ValidateUserQuery: QueryConfig = {
        name: 'validate-user',
        text: `SELECT id, email, user_name, password, salt, full_name FROM users 
        WHERE (user_name = $1)
        OR (email = $1)`,
        values: [payload.email]
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