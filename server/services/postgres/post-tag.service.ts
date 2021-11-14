import { Client, QueryConfig } from 'pg';

import {
  POST_TABLE, POST_TAG_TABLE,
  POST_VOTE_TABLE, TAG_TABLE, USER_TABLE
} from 'constants/tables';

import { QueryParams } from 'interfaces/query-params.type';
import { PostTag } from 'interfaces/post-tag.type';


export async function getPostsByTagId(payload: {[x: string]: any}, queryParams: QueryParams) {

  const DEFAULT_FIELDS = ['id', 'html', 'slug', 'created_by', 'status',
    'mobiledoc', 'created_at', 'published_at', 'banner_image', 'title', 'meta_title'];

  const {
    limit_fields = DEFAULT_FIELDS,
    search = '',
    page = 1,
    limit = 10,
    status = '',
    order = 'ASC',
    sort_field = 'published_at',
    with_table = ['tags', 'users']
  } = queryParams;

  let limitFields: string[] = limit_fields ? (typeof limit_fields === 'string' ? [limit_fields] : limit_fields) : DEFAULT_FIELDS;

  limitFields = limitFields.map((item) => `posts.${item}`);

  let SELECT_CLAUSE = `SELECT ${limitFields}`,
    GROUP_BY_CLAUSE = '',
    JOIN_CLAUSE = `LEFT join ${POST_TABLE} AS posts on posts.id = pt.post_id`;

  if (with_table) {
    GROUP_BY_CLAUSE = 'GROUP BY posts.id';

    if (with_table.includes('users')) {
      // JSON_BUILD_OBJECT is to build object based on selected colums of the row
      const buildUserObj = `'user_name', u.user_name, 'id', u.id, 'avatar', u.avatar`;

      SELECT_CLAUSE = `${SELECT_CLAUSE}, 
                        JSON_BUILD_OBJECT(${buildUserObj}) AS user`;
      GROUP_BY_CLAUSE = `${GROUP_BY_CLAUSE}, u.id`;
      JOIN_CLAUSE = `${JOIN_CLAUSE} LEFT JOIN ${USER_TABLE} AS u ON u.id = posts.created_by`;
    }

    if (with_table.includes('tags')) {
      const buildTagsObj = `'id', t.id, 'name', t.name`;
      SELECT_CLAUSE = `${SELECT_CLAUSE},
                      COALESCE(JSON_AGG(JSON_BUILD_OBJECT(${buildTagsObj})) 
                      FILTER (WHERE t.id IS NOT NULL), '[]') AS tag`;
      JOIN_CLAUSE = `${JOIN_CLAUSE} JOIN ${TAG_TABLE} AS t ON pt.tag_id = t.id`;
    }

    if (with_table.includes('votes')) {
      SELECT_CLAUSE = `${SELECT_CLAUSE}, 
                        count(CASE WHEN votes.value = 1 THEN 1 END) AS upvotes,
                        count(CASE WHEN votes.value = -1 THEN 1 END) AS downvotes,
                        COALESCE(JSON_AGG(votes.user_id) FILTER (WHERE votes.user_id IS NOT NULL), '[]') AS votes`;
      JOIN_CLAUSE = `${JOIN_CLAUSE} LEFT JOIN ${POST_VOTE_TABLE} AS votes on votes.post_id = posts.id`;
    }
  }

  let WHERE_CLAUSE = 'WHERE pt.tag_id = $1';

  const queryValues: any[] = [payload.tagId, +limit, (page - 1) * +limit];

  if (status) {
    queryValues.push(status);
    WHERE_CLAUSE = `${WHERE_CLAUSE} AND posts.status = $${queryValues.length}`;
  }

  if (search) {
    queryValues.push(`%${search}%`);
    WHERE_CLAUSE = `${WHERE_CLAUSE} 
      AND (posts.meta_title LIKE $${queryValues.length} 
      OR posts.meta_description LIKE $${queryValues.length} 
      OR posts.custom_excerpt LIKE $${queryValues.length})`;
  }

  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getPostsByTagIdQuery: QueryConfig = {
    text: `${SELECT_CLAUSE}
            FROM ${POST_TAG_TABLE} AS pt
            ${JOIN_CLAUSE}
            ${WHERE_CLAUSE}
            ${GROUP_BY_CLAUSE}
            ORDER BY 
            posts.${sort_field} ${order}
            LIMIT $2
            OFFSET $3;`,
    values: queryValues
  };

  const getPostsByTagIdCountQuery: QueryConfig = {
    text: `SELECT COUNT(pt.post_id)
            FROM ${POST_TAG_TABLE} AS pt
            JOIN posts on pt.post_id = posts.id
            ${WHERE_CLAUSE}
            LIMIT $2
            OFFSET $3;`,
    values: queryValues
  };

  const userTagData = await postgresClient.query<PostTag>(getPostsByTagIdQuery);
  const userTagCountData = await postgresClient.query<PostTag>(getPostsByTagIdCountQuery);

  if (userTagData.rows && userTagData.rows.length) {
    return { posts: userTagData.rows, ...userTagCountData.rows[0], limit, page};
  }
  throw new Error('Posts not found for the tag');
}

export async function getTagsByPostId(payload: {[x: string]: any}, queryParams: QueryParams) {

  const DEFAULT_FIELDS = ['id', 'name', 'created_by', 'created_at'];

  const {
    limit_fields = DEFAULT_FIELDS,
    search = '',
    page = 1,
    limit = 10,
    order = 'ASC',
    sort_field = 'created_at'
  } = queryParams;

  let WHERE_CLAUSE = 'WHERE pt.post_id = $1';

  const queryValues = [payload.postId, +limit, (page - 1) * +limit];

  if (search) {
    queryValues.push(`%${search}%`);
    WHERE_CLAUSE = `${WHERE_CLAUSE} 
        AND (pt.meta_title LIKE $${queryValues.length} 
        OR pt.meta_description LIKE $${queryValues.length} 
        OR pt.custom_excerpt LIKE $${queryValues.length})`;
  }
  const limitFields = limit_fields.map((item) => `t.${item}`);

  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getTagsByPostIdQuery: QueryConfig = {
    text: `SELECT ${limitFields}
            FROM ${POST_TAG_TABLE} AS pt
            JOIN ${TAG_TABLE} AS t ON pt.tag_id = t.id
            ${WHERE_CLAUSE}
            GROUP BY t.id, pt.created_at
            ORDER BY 
            pt.${sort_field} ${order}
            LIMIT $2
            OFFSET $3;`,
    values: queryValues
  };

  const getTagsByPostIdCountQuery: QueryConfig = {
    text: `SELECT COUNT(pt.tag_id)
            FROM ${POST_TAG_TABLE} AS pt
            ${WHERE_CLAUSE}
            LIMIT $2
            OFFSET $3;`,
    values: queryValues
  };

  const userTagData = await postgresClient.query<PostTag>(getTagsByPostIdQuery);
  const userTagCountData = await postgresClient.query<PostTag>(getTagsByPostIdCountQuery);

  if (userTagData.rows && userTagData.rows.length) {
    return { tags: userTagData.rows, ...userTagCountData.rows[0], limit, page};
  }
  throw new Error('Tags not found for the post');
}

export async function deletePostTag(payload: {[x: string]: any}) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const deletePostTagQuery: QueryConfig = {
      text: `DELETE FROM ${POST_TAG_TABLE}
              WHERE tag_id = $1 AND post_id = $2;`,
      values: [payload.tagId, payload.postId]
    };
    return await postgresClient.query(deletePostTagQuery);
  } catch (err) {
    throw err;
  }
}

export async function deletePostTagsByPostId(payload: {[x: string]: any}) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const deletePostTagsByPostIdQuery: QueryConfig = {
      text: `DELETE FROM ${POST_TAG_TABLE}
              WHERE post_id = $1;`,
      values: [payload.postId]
    };
    return await postgresClient.query(deletePostTagsByPostIdQuery);
  } catch (err) {
    throw err;
  }
}