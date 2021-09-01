import { QueryParams } from 'interfaces/query-params.type';
import { Tag } from 'interfaces/tags.type';
import { QueryConfig, Client } from 'pg';


export async function getTags(queryParams: QueryParams) {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const {
    limit_fields = ['id', 'name', 'description', 'meta_title', 'status', 'slug', 'visibility'],
    search = '',
    page = 1,
    limit = 25,
    order = 'ASC',
    sort_field = 'name'
  } = queryParams;

  const queryValues = [+limit, (page - 1) * +limit, `${sort_field} ${order}`];
  const limitFields: any[] = typeof limit_fields === 'string' ? [limit_fields] : limit_fields;

  const SELECT_CLAUSE = `SELECT ${limitFields.join(',')}`;

  let WHERE_CLAUSE = '';
  if (search) {
    queryValues.push(`%${search}%`);
    WHERE_CLAUSE = `WHERE name LIKE $${queryValues.length}`;
  }

  const EXTRA_CLAUSES = `ORDER BY $3
  LIMIT $1
  OFFSET $2`;

  const getTagsQuery: QueryConfig = {
    text: `${SELECT_CLAUSE} 
          FROM tags
          ${WHERE_CLAUSE}
          ${EXTRA_CLAUSES}`,
    values: queryValues
  };

  const data = await postgresClient.query<Tag>(getTagsQuery);

  return data.rows;
}
