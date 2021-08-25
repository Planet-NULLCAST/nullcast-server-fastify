import {
  Post, DeletePost, mobiledoc, SearchQuery
} from 'interfaces/post.type';
import {DatabaseHandler} from 'services/postgres/postgres.handler';
import {POST_TABLE} from 'constants/tables';
import { default as mobiledocLib} from '../../lib/mobiledoc';

const convertToHTML = (mobiledoc: mobiledoc) => mobiledocLib.mobiledocHtmlRenderer.render(mobiledoc);

const postHandler = new DatabaseHandler(POST_TABLE);


export async function createPostController(postData:Post): Promise<boolean> {
  try {

    const html: string = convertToHTML(postData.mobiledoc as mobiledoc);
    const payload : Post = {
      primary_tag: postData.primary_tag as number,
      html,
      mobiledoc: postData.mobiledoc as mobiledoc,
      slug: postData.slug,
      status: postData.status,
      visibilty: postData.visibilty,
      featured: postData.featured,
      banner_image: postData.banner_image,
      type: postData.type,
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      updated_by: postData.updated_by
    };


    await postHandler.insertOne(payload);
    return true;

  } catch (error) {
    throw error;
  }
}

export async function getPostController(postId:number):Promise<Post> {
  try {
    const fields = ['visibilty', 'featured', 'updated_by', 'status', 'banner_image', 'primary_tag', 'html', 'type', 'slug', 'created_by', 'published_by'];

    return await postHandler.findOneById(postId, fields);
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

export async function getPostsController(getData:SearchQuery): Promise<Post> {
  try {
    return await postHandler.dbHandler<{ getData: SearchQuery }, Post>('GET_POSTS', {
      getData
    });
  } catch (error) {
    throw error;
  }
}
