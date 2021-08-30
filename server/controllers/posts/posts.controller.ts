import {
  Post, DeletePost, mobiledoc, SearchQuery
} from 'interfaces/post.type';
import {DatabaseHandler} from 'services/postgres/postgres.handler';
import {POST_TABLE} from 'constants/tables';
import { default as mobiledocLib} from '../../lib/mobiledoc';
import { QueryParams } from 'interfaces/query-params.type';
import { TokenUser } from 'interfaces/user.type';

const convertToHTML = (mobiledoc: mobiledoc) => mobiledocLib.mobiledocHtmlRenderer.render(mobiledoc);

const postHandler = new DatabaseHandler(POST_TABLE);


export async function createPostController(postData:Post): Promise<boolean> {
  try {

    const html: string = convertToHTML(postData.mobiledoc as mobiledoc);
    const payload : Post = {
      html,
      title: postData.title,
      mobiledoc: postData.mobiledoc as mobiledoc,
      slug: postData.slug,
      banner_image: postData.banner_image,
      created_by: postData.created_by
    };


    await postHandler.insertOne(payload);
    return true;

  } catch (error) {
    throw error;
  }
}

export async function getPostsController(qParam:SearchQuery): Promise<Post> {
  try {
    return await postHandler.dbHandler<SearchQuery, Post>('GET_POSTS', qParam);
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
    return error;
  }
}

export async function updatePostController(postData:Post) :Promise<boolean> {
  try {
    const id = postData.id as number;
    if (!postData.id) {
      return false;
    }

    const html: string = convertToHTML(postData.mobiledoc as mobiledoc);
    const payload : Post = {
      html,
      mobiledoc: postData.mobiledoc as mobiledoc,
      status: postData.status,
      visibilty: postData.visibilty,
      featured: postData.featured,
      banner_image: postData.banner_image,
      type: postData.type,
      updated_at: new Date().toISOString(),
      updated_by: postData.updated_by
    };
    await postHandler.updateOneById(id, payload);
    return true;

  } catch (error) {
    throw error;
  }
}

export async function deletePostController(postData:DeletePost) : Promise<boolean> {
  try {
    const id = postData.id as number;

    if (!id) {
      return false;
    }

    await postHandler.deleteOneById(id);
    return true;
  } catch (error) {
    throw error;
  }
}
