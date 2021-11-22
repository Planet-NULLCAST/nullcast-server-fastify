import { POST_TABLE, USER_ROLE_TABLE } from 'constants/tables';
import { mobiledoc, Post } from 'interfaces/post.type';
import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { default as mobiledocLib} from '../../lib/mobiledoc';


const convertToHTML = (mobiledoc: mobiledoc) => mobiledocLib.mobiledocHtmlRenderer.render(mobiledoc);
const userRoleHandler = new DatabaseHandler(USER_ROLE_TABLE);
const postHandler = new DatabaseHandler(POST_TABLE);

export async function checkAdminController(userId: number): Promise<boolean> {
  try {
    const payload = {
      'userId': userId
    };

    return await userRoleHandler.dbHandler('CHECK_ADMIN', payload) as boolean;
  } catch (error) {
    throw error;
  }
}

export async function adminReviewPostController(postData:Post, userId:number, postId: number) :Promise<Post | boolean> {
  try {
    if (!postId) {
      return false;
    }
    const isAdmin = await checkAdminController(userId);
    const allowedStatus = ['published', 'rejected', 'drafted', 'pending'];

    if (isAdmin) {
      if (postData.status && !(allowedStatus.includes(postData.status.trim().toLowerCase()))) {
        throw { statusCode: 404, message: 'Status of the post is not valid' };
      }
    } else {
        throw { statusCode: 404, message: 'You should have admin access' };
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
