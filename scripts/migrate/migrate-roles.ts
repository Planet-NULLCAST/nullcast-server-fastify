import { Client, QueryConfig } from 'pg';
import { insertMany } from '../../server/services/postgres/query-builder.service';
import * as tableNames from '../../server/constants/tables';
import { migrateUserRoles } from './migrate-user-roles';


export async function migrateRoles() {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;
  const getUserQuery: QueryConfig = {
    text: `SELECT id, user_name 
            FROM ${tableNames.USER_TABLE}
            WHERE user_name = 'nullcast';`
  };
  const userData = await postgresClient.query(getUserQuery);

  const payload = [
    {
      name: 'admin',
      description: 'Admin access'
    },
    {
      name: 'user',
      description: 'User access'
    }
  ];
  const uniqueField = 'name';
  if (userData.rows[0].id) {
    const userId = userData.rows[0].id as number;
    payload.map((item: any) => {
      item.created_by = userId;
    });
  }
  const data = await insertMany(tableNames.ROLE_TABLE, payload, [], uniqueField, true);
  if (data) {
    console.log('Migrated roles');
    await migrateUserRoles();
  }

  return 'Roles migrated';
}
