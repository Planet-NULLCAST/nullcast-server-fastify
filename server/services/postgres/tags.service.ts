import { QueryParams } from 'interfaces/query-params.type';
import { Tag } from 'interfaces/tags.type';
import { QueryConfig, Client } from 'pg';


export async function getTags(queryParams: QueryParams) {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const {
    limit_fields = [],
    search = '',
    page = 1,
    limit = 25,
    order = 'ASC',
    sort_field = 'name'
  } = queryParams;

  const queryValues = [+limit, (page - 1) * +limit, `${sort_field} ${order}`];

  const limitFields:any[] = limit_fields as string[];
  const DefaultFields = 'id, name, description, meta_title, status, slug, visibility';
  const SELECT_CLAUSE = `SELECT ${(limitFields.length) ? limitFields.join(',') : DefaultFields}`;

  let WHERE_CLAUSE = '';
  if (search) {
    queryValues.push(`%${search}%`);
    WHERE_CLAUSE = `WHERE name LIKE $${queryValues.length}`;
  }

  const CONDITIONS_CLAUSE = `ORDER BY $3
  LIMIT $1
  OFFSET $2`;

  const getTagsQuery: QueryConfig = {
    text: `${SELECT_CLAUSE} 
          FROM tags
          ${WHERE_CLAUSE}
          ${CONDITIONS_CLAUSE}`,
    values: queryValues
  };

  const data = await postgresClient.query<Tag>(getTagsQuery);

  return data.rows;
  // if (search) {
  //   const getTagsQuery: QueryConfig = {
  //     text: `SELECT id, name, description, meta_title, feature_image, slug, visibility, status
  //         FROM tags
  //         WHERE name LIKE '%${search}%'
  //         ORDER BY name ${order}
  //         limit ${limit};`
  //   };
  // const data = await postgresClient.query<Tag>(getTagsQuery);
  // return data.rows;
  // }
}
