import { default as mobiledocLib} from '../../lib/mobiledoc';
import {POST_TABLE} from 'constants/tables';

import {Post, mobiledoc} from 'interfaces/post.type';
import { QueryParams } from 'interfaces/query-params.type';
import { TokenUser } from 'interfaces/user.type';

import {DatabaseHandler} from 'services/postgres/postgres.handler';
import { checkAdminController } from 'controllers';


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

    const fields = ['id', 'html', 'created_at', 'created_by', 'mobiledoc', 'status', 'published_at', 'updated_at', 'meta_title', 'title'];

    const data = await postHandler.insertOne(payload, fields);
    return data.rows[0] as Post;

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

export async function getPostsController(qParam:QueryParams): Promise<Post> {
  try {
    return await postHandler.dbHandler<QueryParams, Post>('GET_POSTS', qParam);
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

export async function getPostsByUserIdController(
  queryParams: QueryParams, userId: number): Promise<Post> {
  try {
    const payload = {
      userId
    };
    return await postHandler.dbHandler('GET_POSTS_BY_USER_ID', payload, queryParams);

  } catch (error) {
    throw error;
  }
}

export async function getPostsCountController(
  queryParams: QueryParams, userId: number) {
  try {
    const payload = {
      userId
    };
    return await postHandler.dbHandler('GET_POSTS_COUNT', payload, queryParams);

  } catch (error) {
    throw error;
  }
}

export async function getAllPostUrlController() {
  try {
    const fields = ['slug'];
    const payload = {
      'status': 'published'
    };
    const events =  await postHandler.findMany(payload, fields);
    return events;
  } catch (error) {
    throw error;
  }
}

export async function updatePostController(postData:Post, userId:number, postId: number) :Promise<Post | boolean> {
  try {
    if (!postId) {
      return false;
    }
    const isAdmin = await checkAdminController(userId);
    const adminStatus = ['published', 'rejected'];
    const allowedStatus = ['drafted', 'pending'];

    if (isAdmin) {
      if (postData.status && !(adminStatus.concat(allowedStatus).includes(postData.status.trim().toLowerCase()))) {
        throw { statusCode: 404, message: 'Status of the post is not valid' };
      }
    } else {
      if (postData.status && !(allowedStatus.includes(postData.status.trim().toLowerCase()))) {
        if (adminStatus.includes(postData.status.trim().toLowerCase())) {
          throw { statusCode: 404, message: 'You should have admin access' };
        }
        throw { statusCode: 404, message: 'Status of the post is not valid' };
      }
    }

    const payload : Post = {
      ...postData,
      updated_at: new Date().toISOString(),
      updated_by: userId
    };

    if (postData.mobiledoc) {
      const html: string = convertToHTML(postData.mobiledoc as mobiledoc);
      payload.html = html;
      payload.mobiledoc = postData.mobiledoc as mobiledoc;
    }

    if (postData.status == 'published') {
      payload.published_at = new Date().toISOString();
    }

    const fields = ['id', 'html', 'created_at', 'created_by', 'mobiledoc',
      'status', 'published_at', 'updated_at', 'meta_title', 'title'];

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
