import {POST_TABLE, USER_ROLE_TABLE} from 'constants/tables';
import { Activity } from 'interfaces/activities.type';
import { mobiledoc, Post } from 'interfaces/post.type';
import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { findActivityType } from 'utils/activities.utils';
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

export async function adminReviewPostController(postData:Post, userId:number, postId: number): Promise<boolean> {
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

    // post data
    const post : Post = {
      ...postData,
      id: postId,
      updated_at: new Date().toISOString(),
      updated_by: userId
    };

    if (postData.mobiledoc) {
      const html: string = convertToHTML(postData.mobiledoc as mobiledoc);
      post.html = html;
      post.mobiledoc = postData.mobiledoc as mobiledoc;
    }

    if (postData.status == 'published') {
      post.published_at = new Date().toISOString();
    }

    // activity data
    const activity = findActivityType('published_post') as Activity;
    activity.post_id = post.id;

    const payload = [post, activity];

    const data = await postHandler.dbHandler('UPDATE_AND_PUBLISH_POST', payload);
    return data as boolean;

  } catch (error) {
    throw error;
  }
}
