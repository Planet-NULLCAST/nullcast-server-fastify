import { POST_TAG_TABLE } from 'constants/tables';

import { DatabaseHandler } from 'services/postgres/postgres.handler';

import { TokenUser } from 'interfaces/user.type';
import { QueryParams } from 'interfaces/query-params.type';
import { PostTag } from 'interfaces/post-tag.type';
import { Tag } from 'interfaces/tags.type';
import { Post } from 'interfaces/post.type';


const postTagHandler = new DatabaseHandler(POST_TAG_TABLE);

export async function createPostTagController(postTagData: PostTag, user:TokenUser): Promise<PostTag> {
  const payload: PostTag = {
    tag_id: postTagData.tag_id as number,
    post_id: postTagData.post_id as number,
    created_by: user.id as number
  };

  const fields = ['tag_id', 'post_id', 'created_by', 'created_at'];

  const data = await postTagHandler.insertOne(payload, fields);

  return data.rows[0] as PostTag;
}

export async function createPostTagsController(postTagData: PostTag[], user:TokenUser): Promise<PostTag[]> {

  for (const postTag of postTagData) {
    postTag.created_by = user.id as number;
  }

  const payload: PostTag[] = postTagData;

  const fields = ['tag_id', 'post_id', 'created_by', 'created_at'];
  const uniqueField = 'post_id, tag_id';
  const needUpdate = false;

  const data = await postTagHandler.insertMany(payload, fields, uniqueField, needUpdate);

  return data.rows as PostTag[];
}

export async function getPostsByTagIdController(queryParams:QueryParams, tagId:number):Promise<Post> {
  try {
    const payload = {
      'tagId': tagId
    };

    return await postTagHandler.dbHandler('GET_POSTS_BY_TAG_ID', payload, queryParams);

  } catch (error) {
    throw error;
  }
}

export async function getTagsByPostIdController(queryParams:QueryParams, postId:number):Promise<Tag> {
  try {
    const payload = {
      'postId': postId
    };

    return await postTagHandler.dbHandler('GET_TAGS_BY_POST_ID', payload, queryParams);

  } catch (error) {
    throw error;
  }
}

export async function deletePostTagController(tagId: number, postId: number) : Promise<boolean> {
  try {
    if (!(tagId && postId)) {
      return false;
    }

    const payload = {
      'tagId': tagId,
      'postId': postId
    };

    await postTagHandler.dbHandler('DELETE_POST_TAG', payload);
    return true;
  } catch (error) {
    throw error;
  }
}
