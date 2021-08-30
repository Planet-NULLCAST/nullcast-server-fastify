import { Client, QueryConfig } from 'pg';
import { Post } from 'interfaces/post.type';
import { QueryParams } from 'interfaces/query-params.type';

const DEFAULT_FIELDS = 'id, slug, created_by, html, mobiledoc, created_at',
  DEFAULT_JOINS = 'users';

function constructJoinQuery({
  limit_fields = DEFAULT_FIELDS,
  with_table = DEFAULT_JOINS
}: QueryParams) {
  // Set default values for query param

  limit_fields = limit_fields
    .split(',')
    .map((item) => `post.${item.trim()}`)
    .join(', ');

  let SELECT_CLAUSE = `SELECT ${limit_fields}`,
    JOIN_CLAUSE = '',
    GROUP_BY_CLAUSE = '';

  if (with_table) {
    GROUP_BY_CLAUSE = `GROUP BY post.id`;

    if (with_table.includes('users')) {
      // JSON_BUILD_OBJECT is to build object based on selected colums of the row
      const buildUserObj = `'user_name', u.user_name, 'id', u.id, 'avatar', u.avatar`;

      SELECT_CLAUSE = `${SELECT_CLAUSE}, JSON_BUILD_OBJECT(${buildUserObj}) AS user`;
      JOIN_CLAUSE = `${JOIN_CLAUSE} JOIN users AS u ON u.id = post.created_by`;
      GROUP_BY_CLAUSE = `${GROUP_BY_CLAUSE}, u.id`;
    }

    if (with_table.includes('tags')) {
      const buildTagsObj = `'id', tag.id, 'name', tag.name`;
      SELECT_CLAUSE = `${SELECT_CLAUSE},
                        COALESCE(JSON_AGG(JSON_BUILD_OBJECT(${buildTagsObj})) 
                        FILTER (WHERE tag.id IS NOT NULL), '[]') AS tags`;
      JOIN_CLAUSE = `${JOIN_CLAUSE}
                          LEFT JOIN post_tags on post.id = post_tags.post_id
                          LEFT JOIN tags AS tag on tag.id = post_tags.tag_id`;
    }

    if (with_table.includes('votes')) {
      SELECT_CLAUSE = `${SELECT_CLAUSE}, 
                          count(CASE WHEN votes.value = 1 THEN 1 END) AS upvotes,
                          count(CASE WHEN votes.value = -1 THEN 1 END) AS downvotes,
                          COALESCE(JSON_AGG(votes.user_id) FILTER (WHERE votes.user_id IS NOT NULL), '[]') AS votes`;
      JOIN_CLAUSE = `${JOIN_CLAUSE}
                          LEFT JOIN post_votes AS votes ON votes.id = post.id`;
    }
  }

  return { SELECT_CLAUSE, JOIN_CLAUSE, GROUP_BY_CLAUSE };
}

export async function getPosts(queryParams: QueryParams) {
  // Set default values for query params
  const {
    limit_fields,
    search = '',
    page = 1,
    limit = 10,
    status = 'drafted',
    order = 'ASC',
    sort_field = 'id',
    with_table
  } = queryParams;

  let WHERE_CLAUSE = 'WHERE post.status = $1';

  const queryValues = [status, +limit, (page - 1) * +limit];

  if (search) {
    queryValues.push(`%${search}%`);
    WHERE_CLAUSE = `${WHERE_CLAUSE} 
      AND (post.meta_title LIKE $${queryValues.length} 
      OR post.meta_description LIKE $${queryValues.length} 
      OR post.custom_excerpt LIKE $${queryValues.length})`;
  }
  const { SELECT_CLAUSE, JOIN_CLAUSE, GROUP_BY_CLAUSE } = constructJoinQuery({
    limit_fields,
    with_table
  });

  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getPostsQuery: QueryConfig = {
    text: `${SELECT_CLAUSE}
            FROM posts AS post
            ${JOIN_CLAUSE}
            ${WHERE_CLAUSE}
            ${GROUP_BY_CLAUSE}
            ORDER BY 
              post.${sort_field} ${order}
            LIMIT $2
            OFFSET $3;`,
    values: queryValues
  };

  const data = await postgresClient.query<Post>(getPostsQuery);

  return data.rows;
}

export async function getSinglePost(
  payload: { key: string | number; field: string },
  queryParams: QueryParams
) {
  const { key, field = 'id' } = payload;
  // Set default values for query params
  const { limit_fields, with_table } = queryParams;

  const WHERE_CLAUSE = `WHERE post.${field} = $1`;

  const queryValues = [key];

  const { SELECT_CLAUSE, JOIN_CLAUSE, GROUP_BY_CLAUSE } = constructJoinQuery({
    limit_fields,
    with_table
  });

  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getPostsQuery: QueryConfig = {
    text: `${SELECT_CLAUSE}
            FROM posts AS post
            ${JOIN_CLAUSE}
            ${WHERE_CLAUSE}
            ${GROUP_BY_CLAUSE};`,
    values: queryValues
  };

  const data = await postgresClient.query<Post>(getPostsQuery);

  return data.rows[0];
}

export async function getPostsBytag() {
  /**
   * select posts.id as post_id, posts.html as html,
COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', t.id, 'name', t.name)) FILTER (WHERE t.id IS NOT NULL), '[]') AS tag,
JSON_BUILD_OBJECT('id', u.id, 'user_name', u.user_name) AS user,
count(CASE WHEN votes.value = 1 THEN 1 END) as upvotes,
count(CASE WHEN votes.value = -1 THEN 1 END) as downvotes

from tags

join post_tags on post_tags.tag_id = tags.id
LEFT join posts on posts.id = post_tags.post_id
LEFT JOIN post_votes as votes on votes.id = posts.id
JOIN users AS u ON u.id = posts.created_by
LEFT join post_tags as pt on pt.post_id = posts.id
JOIN tags as t on post_tags.tag_id = pt.tag_id

where tags.name = 'js'
GROUP BY posts.id, u.user_name, u.id
   */
}
