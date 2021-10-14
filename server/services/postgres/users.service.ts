import { Client, QueryConfig } from 'pg';

import { User, UserStatus } from 'interfaces/user.type';
import { QueryParams } from 'interfaces/query-params.type';


export async function getUser(payload: { user_name: string }): Promise<User> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getUserQuery: QueryConfig = {
    name: 'get-user',
    text: `SELECT entity_id, id, user_name, full_name,
            email, created_at, updated_at, cover_image, bio, status
            FROM users
            WHERE user_name = $1;`,
    values: [payload.user_name]
  };

  const data = await postgresClient.query<User>(getUserQuery);

  if (data.rows && data.rows.length) {
    return {
      id: data.rows[0]?.id as number,
      user_name: data.rows[0]?.user_name as string,
      password: '',
      salt: data.rows[0]?.salt as string,
      full_name: data.rows[0]?.full_name as string,
      email: data.rows[0]?.email as string,
      created_at: data.rows[0]?.created_at as string,
      updated_at: data.rows[0]?.updated_at as string,
      bio: data.rows[0]?.bio as string,
      status: data.rows[0]?.status as UserStatus,
      slug: data.rows[0]?.slug as string,
      primary_badge: data.rows[0]?.primary_badge as number
    };
  }
  throw new Error('User not found');
}

export async function getUsers(queryParams: QueryParams) {
  // Set default values for query params

  const DEFAULT_FIELDS = ['id', 'user_name', 'full_name', 'avatar'];
  const {
    limit_fields,
    search = '',
    page = 1,
    limit = 10,
    status = 'active',
    order = 'ASC',
    sort_field = 'created_at',
    with_table = ['entity', 'primary_badge']
  } = queryParams;

  let limitFields: string[] = limit_fields ? (typeof limit_fields === 'string' ? [limit_fields] : limit_fields) : DEFAULT_FIELDS;

  limitFields = limitFields.map((item) => `u.${item}`);

  let SELECT_CLAUSE = `SELECT u.id as user_id, ${limitFields}`,
    JOIN_CLAUSE = '',
    WHERE_CLAUSE = 'WHERE u.status = $1',
    GROUP_BY_CLAUSE = 'GROUP BY user_id';

  const queryValues = [status, +limit, (page - 1) * +limit];

  if (search) {
    queryValues.push(`%${search}%`);
    WHERE_CLAUSE = `${WHERE_CLAUSE} 
      AND (u.meta_title LIKE $${queryValues.length} 
      OR u.meta_description LIKE $${queryValues.length})`;
  }

  if (with_table.includes('entity')) {
    const buildEntityObj = `'id', entity.id, 'name', entity.name, 'description', entity.description`;
    SELECT_CLAUSE = `${SELECT_CLAUSE}, 
                      JSON_BUILD_OBJECT(${buildEntityObj}) AS entity`;
    JOIN_CLAUSE = `${JOIN_CLAUSE} LEFT JOIN entity on u.entity_id = entity.id`;
    WHERE_CLAUSE = `${WHERE_CLAUSE} AND u.entity_id = entity.id`;
    GROUP_BY_CLAUSE = `${GROUP_BY_CLAUSE}, entity.id`;
  }

  if (with_table.includes('primary_badge')) {
    const buildBadgeObj = `'id', badge.id, 'name', badge.name, 'description', badge.description`;
    SELECT_CLAUSE = `${SELECT_CLAUSE}, 
                      JSON_BUILD_OBJECT(${buildBadgeObj}) AS primary_badge`;
    JOIN_CLAUSE = `${JOIN_CLAUSE} 
                    LEFT JOIN badges as badge on u.primary_badge = badge.id`;
    WHERE_CLAUSE = `${WHERE_CLAUSE} AND u.primary_badge = badge.id`;
    GROUP_BY_CLAUSE = `${GROUP_BY_CLAUSE}, badge.id`;
  }

  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getUsersQuery: QueryConfig = {
    text: `${SELECT_CLAUSE}
            FROM users AS u
            ${JOIN_CLAUSE}
            ${WHERE_CLAUSE}
            ${GROUP_BY_CLAUSE}
            ORDER BY 
            u.${sort_field} ${order}
            LIMIT $2
            OFFSET $3;`,
    values: queryValues
  };

  const getUsersCountQuery: QueryConfig = {
    text: `SELECT COUNT(u.id)
            FROM users AS u
            ${JOIN_CLAUSE}
            ${WHERE_CLAUSE}
            LIMIT $2
            OFFSET $3;`,
    values: queryValues
  };

  const userData = await postgresClient.query(getUsersQuery);
  const countData = await postgresClient.query(getUsersCountQuery);

  return {users: userData.rows, ...countData.rows[0], limit, page};
}
