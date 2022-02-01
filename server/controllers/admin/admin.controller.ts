
import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { findActivityType } from 'utils/activities.utils';
import { default as mobiledocLib} from '../../lib/mobiledoc';
import {
  EVENT_TABLE, POST_TABLE, USER_ROLE_TABLE
} from 'constants/tables';
import { Activity } from 'interfaces/activities.type';
import { Event } from 'interfaces/event.type';
import { mobiledoc, Post } from 'interfaces/post.type';


const convertToHTML = (mobiledoc: mobiledoc) => mobiledocLib.mobiledocHtmlRenderer.render(mobiledoc);
const userRoleHandler = new DatabaseHandler(USER_ROLE_TABLE);
const postHandler = new DatabaseHandler(POST_TABLE);
const eventHandler = new DatabaseHandler(EVENT_TABLE);

export async function AdminCreateEventController(eventData:Event, userId:number): Promise<Event> {
  try {
    const isAdmin = await checkAdminController(userId);

    if (isAdmin) {
      const slug = eventData.title.toLowerCase().split(' ').join('-');
      const payload : Event = {
        title: eventData.title,
        meta_title: eventData.meta_title,
        description: eventData.description,
        meta_description: eventData.meta_description,
        guest_name: eventData.guest_name,
        guest_designation: eventData.guest_designation,
        guest_image: eventData.guest_image,
        guest_bio: eventData.guest_bio,
        registration_link: eventData.registration_link,
        event_time: eventData.event_time,
        status: 'published',
        slug,
        location: eventData.location,
        banner_image: eventData.banner_image,
        created_by: userId,
        user_id: userId
      };

      const fields = ['id', 'title', 'guest_name', 'guest_designation', 'guest_image', 'registration_link', 'guest_bio', 'created_at', 'created_by',
        'slug', 'status', 'published_at', 'banner_image', 'updated_at', 'meta_title', 'description', 'meta_description', 'location', 'primary_tag', 'event_time'];

      const data = await eventHandler.insertOne(payload, fields);
      return data.rows[0] as Event;
    }
    throw {statusCode: 404, message: 'User has no admin access'};

  } catch (error) {
    throw error;
  }
}

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
    const activity = await findActivityType('published_post') as Activity;
    activity.post_id = post.id;

    const payload = [post, activity];

    const data = await postHandler.dbHandler('UPDATE_AND_PUBLISH_POST', payload);
    return data as boolean;

  } catch (error) {
    throw error;
  }
}

export async function adminReviewEventController(
  eventData:Event, userId:number, eventId: number) :Promise<Event | boolean> {
  try {
    if (!eventId) {
      return false;
    }

    const isAdmin = await checkAdminController(userId);
    const allowedStatus = ['published', 'rejected', 'drafted', 'pending'];

    if (isAdmin) {
      if (eventData.status && !(allowedStatus.includes(eventData.status.trim().toLowerCase()))) {
        throw { statusCode: 404, message: 'Status of the post is not valid' };
      }
    } else {
      throw { statusCode: 404, message: 'You should have admin access' };
    }

    const payload : Event = {
      ...eventData,
      updated_at: new Date().toISOString(),
      updated_by: userId
    };

    const fields = ['id', 'created_at', 'created_by', 'status', 'published_at', 'banner_image', 'slug',
      'updated_at', 'updated_by', 'meta_title', 'description', 'meta_description', 'location', 'primary_tag', 'event_time'];

    const data = await eventHandler.updateOneById(eventId, payload, fields);
    return data.rows[0] as Event;

  } catch (error) {
    throw error;
  }
}
