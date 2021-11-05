import { Client, QueryConfig } from "pg";

import { SUBSCRIBER_TABLE } from "constants/tables";

import { QueryParams } from "interfaces/query-params.type";


export async function getSubscribers(queryParams: QueryParams) {
  // Set default values for query params

  const DEFAULT_FIELDS = ['id', 'email', 'created_at', 'last_notified'];
  const {
    limit_fields,
    search = '',
    page = 1,
    limit = 10,
    order = 'ASC',
    sort_field = 'created_at',
  } = queryParams;

  let limitFields: string[] = limit_fields ? (typeof limit_fields === 'string' ? [limit_fields] : limit_fields) : DEFAULT_FIELDS;

  limitFields = limitFields.map((item) => `sub.${item}`);

  let WHERE_CLAUSE = '';
  const queryValues: any = [+limit, (page - 1) * +limit];

  if (search) {
    queryValues.push(`%${search}%`);
    WHERE_CLAUSE = `WHERE
                    sub.meta_title LIKE $${queryValues.length} 
                    OR sub.meta_description LIKE $${queryValues.length} 
                    OR sub.custom_excerpt LIKE $${queryValues.length}`;
  }

  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getSubscribersQuery: QueryConfig = {
      text: `SELECT ${limitFields}
              FROM ${SUBSCRIBER_TABLE} AS sub
              ${WHERE_CLAUSE}
              ORDER BY 
              sub.${sort_field} ${order}
              LIMIT $1
              OFFSET $2;`,
      values: queryValues
    };

  const getSubscribersCountQuery: QueryConfig = {
    text: `SELECT COUNT(sub.id)
            FROM ${SUBSCRIBER_TABLE} AS sub
            ${WHERE_CLAUSE}
            LIMIT $1
            OFFSET $2;`,
    values: queryValues
  };

  const subscriptionData = await postgresClient.query(getSubscribersQuery);
  const countData = await postgresClient.query(getSubscribersCountQuery);

  return {users: subscriptionData.rows, ...countData.rows[0], limit, page};
}