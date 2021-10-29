import { Client, QueryConfig } from 'pg';

import { TAG_TABLE, USER_TAG_TABLE } from 'constants/tables';

import { QueryParams } from 'interfaces/query-params.type';
import { UpdateUserTag, UserTag } from 'interfaces/user-tag.type';
import { TokenUser } from 'interfaces/user.type';


export async function getUserTagsByUserId(payload: {[x: string]: any}, queryParams: QueryParams) {

  const DEFAULT_FIELDS = ['id', 'name', 'status', 'created_by', 'created_at'];

  const {
    limit_fields = DEFAULT_FIELDS,
    search = '',
    page = 1,
    limit = 10,
    order = 'ASC',
    sort_field = 'created_at'
  } = queryParams;

  let WHERE_CLAUSE = 'WHERE ut.user_id = $1';

  const queryValues = [payload.userId, +limit, (page - 1) * +limit];

  if (search) {
    queryValues.push(`%${search}%`);
    WHERE_CLAUSE = `${WHERE_CLAUSE} 
        AND (ut.meta_title LIKE $${queryValues.length} 
        OR ut.meta_description LIKE $${queryValues.length} 
        OR ut.custom_excerpt LIKE $${queryValues.length})`;
  }
  const limitFields = limit_fields.map((item) => `t.${item}`);

  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getUserTagsQuery: QueryConfig = {
    text: `SELECT ${limitFields}
            FROM ${USER_TAG_TABLE} AS ut
            JOIN ${TAG_TABLE} AS t ON ut.tag_id = t.id
            ${WHERE_CLAUSE}
            GROUP BY t.id, ut.${sort_field}
            ORDER BY 
            ut.${sort_field} ${order}
            LIMIT $2
            OFFSET $3;`,
    values: queryValues
  };

  console.log(`SELECT ${limitFields}
  FROM ${USER_TAG_TABLE} AS ut
  ${WHERE_CLAUSE}
  LIMIT $2
  OFFSET $3`);

  const getUserTagsCountQuery: QueryConfig = {
    text: `SELECT COUNT(t.id)
            FROM ${USER_TAG_TABLE} AS ut
            JOIN ${TAG_TABLE} AS t ON ut.tag_id = t.id
            ${WHERE_CLAUSE}
            LIMIT $2
            OFFSET $3;`,
    values: queryValues
  };

  const userTagData = await postgresClient.query<UserTag>(getUserTagsQuery);
  const userTagCountData = await postgresClient.query(getUserTagsCountQuery);

  if (userTagData.rows && userTagData.rows.length) {
    return  {data:userTagData.rows, ...userTagCountData.rows[0], limit, page};
  }
  throw new Error('Tags not found for the user');
}

export async function updateUserTag(
  // eslint-disable-next-line no-empty-pattern
  payload: UpdateUserTag, {}, user: TokenUser, otherConstraints: {[x: string]: any}):
Promise<UserTag> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  let updateStatement = 'SET';
  const payloadArray = Object.entries(payload);

  const queryValues = [otherConstraints.tagId, user.id];

  payloadArray.forEach(([key, value], index) => {
    queryValues.push(value);
    if (index !== payloadArray.length - 1) {
      updateStatement = `${updateStatement} ${key} = $${queryValues.length},`;
    } else {
      updateStatement = `${updateStatement} ${key} = $${queryValues.length}`;
    }
  });

  const fields = ['tag_id', 'user_id', 'created_by', 'created_at'];
  const returningStatement = `RETURNING ${fields.map((item) => item).join(', ')}`;

  const updateUserTagQuery: QueryConfig = {
    name: 'update-user-tag',
    text: `UPDATE ${USER_TAG_TABLE}
          ${updateStatement}
          WHERE tag_id = $1 AND user_id = $2
          ${returningStatement};`,
    values: queryValues
  };
  const data = await postgresClient.query(updateUserTagQuery);
  if (data.rows && data.rows.length) {
    return data.rows[0] as UserTag;
  }
  throw new Error('Something error occurred');
}

export async function deleteUserTag(payload: {[x: string]: any}) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const deleteUserTagQuery: QueryConfig = {
      name: 'delete-user-tag',
      text: `DELETE FROM ${USER_TAG_TABLE}
              WHERE tag_id = $1 AND user_id = $2;`,
      values: [payload.tagId, payload.userId]
    };
    return await postgresClient.query(deleteUserTagQuery);
  } catch (err) {
    throw err;
  }
}
