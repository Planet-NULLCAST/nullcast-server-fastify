import { Client, QueryConfig } from 'pg';
import { Post, SearchQuery } from 'interfaces/post.type';

export async function getPosts(
  queryParams: SearchQuery
) {
  const defaultLimitValues =
      'id, primary_tag, slug, created_by, published_by, html, mobiledoc';
    // TODO: Check if certain query params exists and modify the prepared statements accordingly
  const {
    limit_fields = defaultLimitValues,
    search='',
    page = 1,
    limit = 10,
    status='published',
    order = 'ASC',
    sort_field = 'created_at'
  } = queryParams;

  let whereClause = 'WHERE status = $1';
  const queryValues = [status, limit, order, (page-1)*limit, sort_field];

  if (search) {
    queryValues.push(search);
    whereClause = `${whereClause} 
      AND (meta_title LIKE ${queryValues.length+1} 
      OR meta_description LIKE ${queryValues.length+1} 
      OR custom_excerpt LIKE ${queryValues.length+1})`;
  }

  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getPostsQuery: QueryConfig = {
    name: 'get-posts',
    text: `SELECT ${limit_fields}
            FROM posts 
            ${whereClause}
            LIMIT = $2
            ORDER BY $5 $3
            OFFSET = $4;`,
    values: queryValues
  };

  const data = await postgresClient.query<Post>(getPostsQuery);

  return data.rows;
}
