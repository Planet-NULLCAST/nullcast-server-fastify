import {Post, mobiledoc} from 'interfaces/post.type';
import {DatabaseHandler} from 'services/postgres/postgres.handler';
import {POST_TABLE} from 'constants/tables';
import { default as mobiledocLib} from '../../lib/mobiledoc';
import { QueryParams } from 'interfaces/query-params.type';
import { TokenUser } from 'interfaces/user.type';

const convertToHTML = (mobiledoc: mobiledoc) => mobiledocLib.mobiledocHtmlRenderer.render(mobiledoc);

const postHandler = new DatabaseHandler(POST_TABLE);


export async function createPostController(postData:Post, userId:number): Promise<Post> {
  try {

    const html: string = convertToHTML(postData.mobiledoc as mobiledoc);
    const payload : Post = {
      html,
      title: postData.title,
      meta_title: postData.meta_title,
      mobiledoc: postData.mobiledoc as mobiledoc,
      slug: postData.slug,
      banner_image: postData.banner_image,
      created_by: userId
    };

    const fields = ['html', 'created_at', 'created_by', 'mobiledoc', 'status', 'published_at', 'updated_at', 'meta_title', 'title'];

    const data = await postHandler.insertOne(payload, fields);
    return data.rows[0] as Post;

  } catch (error) {
    throw error;
  }
}

export async function getPostsController(qParam:QueryParams): Promise<Post> {
  try {
    return await postHandler.dbHandler<QueryParams, Post>('GET_POSTS', qParam);
  } catch (error) {
    throw error;
  }
}

export async function getPostController(postId:number, queryParams: QueryParams, user: TokenUser):Promise<Post> {
  try {
    const payload = {
      key: postId,
      field: 'id'
    };
    return await postHandler.dbHandler('GET_POST', payload, queryParams, user);

  } catch (error) {
    throw error;
  }
}

export async function getPostBySlugController(slug:string, queryParams: QueryParams, user: TokenUser):Promise<Post> {
  try {
    const payload = {
      key: slug,
      field: 'slug'
    };
    return await postHandler.dbHandler('GET_POST', payload, queryParams, user);

  } catch (error) {
    throw error;
  }
}

export async function getPostsByTagController(tag: string, queryParams: QueryParams, user: TokenUser):Promise<Post> {
  try {
    const payload = {
      key: tag,
      field: 'tag'
    };
    return await postHandler.dbHandler('GET_POSTS_BY_TAG', payload, queryParams, user);

  } catch (error) {
    throw error;
  }
}

export async function updatePostController(postData:Post, userId:number, postId: number) :Promise<Post | boolean> {
  try {
    if (!postId) {
      return false;
    }

    const html: string = convertToHTML(postData.mobiledoc as mobiledoc);
    const payload : Post = {
      ...postData,
      html,
      mobiledoc: postData.mobiledoc as mobiledoc,
      updated_at: new Date().toISOString(),
      updated_by: userId
    };

    const fields = ['html', 'created_at', 'created_by', 'mobiledoc', 'status', 'published_at', 'updated_at', 'meta_title', 'title'];

    const data = await postHandler.updateOneById(postId, payload, fields);
    return data.rows[0] as Post;

  } catch (error) {
    throw error;
  }
}

export async function deletePostController(postId: number) : Promise<boolean> {
  try {
    if (!postId) {
      return false;
    }

    await postHandler.deleteOneById(postId);
    return true;
  } catch (error) {
    throw error;
  }
}


export async function getPostsByUserIdController(
  queryParams: QueryParams, currentUser: TokenUser, userId: number):Promise<Post> {
  try {
    const payload = {
      key: userId,
      field: 'id'
    };
    return await postHandler.dbHandler('GET_POSTS_BY_USER_ID', payload, queryParams, currentUser);

  } catch (error) {
    throw error;
  }
}
