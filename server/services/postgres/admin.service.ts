import { Client, QueryConfig } from 'pg';

import { USER_ROLE_TABLE, ROLE_TABLE } from 'constants/tables';


export async function checkAdmin(payload: {userId: number}) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const chechAdminQuery: QueryConfig = {
      text: `SELECT ur.user_id AS user_id, role.name 
            FROM ${USER_ROLE_TABLE} AS ur
            LEFT JOIN ${ROLE_TABLE} AS role ON role.id = ur.role_id
            WHERE user_id = $1 AND role.name = 'admin';`,
      values: [payload.userId]
    };

    const queryData = await postgresClient.query(chechAdminQuery);

    if (queryData.rows.length) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

