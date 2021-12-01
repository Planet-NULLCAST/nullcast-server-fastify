import { Client, QueryConfig } from 'pg';
import * as tableNames from '../../server/constants/tables';

export async function migrateUserRoles() {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;
  const getRoleQuery: QueryConfig = {
    text: `SELECT id 
            FROM ${tableNames.ROLE_TABLE}
            WHERE name = 'user';`
  };
  const data = await postgresClient.query(getRoleQuery);

  const roleId = data.rows[0].id as number;

  const AddUserRoleQuery: QueryConfig = {
    text: `INSERT INTO 
            ${tableNames.USER_ROLE_TABLE}
            (user_id, role_id, created_by)
            SELECT u.id, ${roleId}, u.id
            FROM ${tableNames.USER_TABLE} AS u
            ON CONFLICT (user_id, role_id)
            DO NOTHING;`
  };
  await postgresClient.query(AddUserRoleQuery);
  console.log('User roles migrated');
}
