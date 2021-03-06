import {DatabaseHandler} from 'services/postgres/postgres.handler';
import { EVENT_TABLE } from 'constants/tables';
import { Event } from 'interfaces/event.type';
import { QueryParams } from 'interfaces/query-params.type';
import { checkAdminController } from 'controllers';


const eventHandler = new DatabaseHandler(EVENT_TABLE);

export async function requestEventController(eventData:Event, userId:number): Promise<Event> {
  try {
    const isAdmin = await checkAdminController(userId);
    const adminStatus = ['published', 'rejected'];
    const allowedStatus = ['drafted', 'pending'];

    if (isAdmin) {
      if (eventData.status && !(adminStatus.concat(allowedStatus).includes(eventData.status.trim().toLowerCase()))) {
        throw { statusCode: 404, message: 'Status of the post is not valid' };
      }
    } else {
      if (eventData.status && !(allowedStatus.includes(eventData.status.trim().toLowerCase()))) {
        if (adminStatus.includes(eventData.status.trim().toLowerCase())) {
          throw { statusCode: 404, message: 'You should have admin access' };
        }
        throw { statusCode: 404, message: 'Status of the post is not valid' };
      }
    }

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
      status: eventData.status,
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

  } catch (error) {
    throw error;
  }
}

export async function getEventController(eventId:number):Promise<Event> {
  try {
    const fields = ['id', 'title', 'guest_name', 'guest_designation', 'guest_image', 'registration_link', 'guest_bio', 'created_at', 'created_by',
      'status', 'published_at', 'banner_image', 'updated_at', 'meta_title', 'description', 'meta_description', 'location', 'primary_tag', 'event_time'];

    return await eventHandler.findOneById(eventId, fields) as Event;

  } catch (error) {
    throw error;
  }
}

export async function getEventBySlugController(slug:string):Promise<Event> {
  try {
    const payload = {
      'slug': slug
    };

    return await eventHandler.dbHandler('GET_EVENT_BY_SLUG', payload) as Event;

  } catch (error) {
    throw error;
  }
}

export async function getEventsController(queryParams:QueryParams):Promise<Event> {
  try {

    return await eventHandler.dbHandler('GET_EVENTS', queryParams);

  } catch (error) {
    throw error;
  }
}

export async function getAllEventUrlController() {
  try {
    const fields = ['slug'];
    const payload = {
      'status': 'published'
    };
    const events =  await eventHandler.findMany(payload, fields);
    return events;
  } catch (error) {
    throw error;
  }
}

export async function getEventsByUserIdController(queryParams:QueryParams, userId:number):Promise<Event> {
  try {
    const payload: {userId: number} = {userId};

    return await eventHandler.dbHandler('GET_EVENTS_BY_USER_ID', payload, queryParams);

  } catch (error) {
    throw error;
  }
}

export async function updateEventController(eventData:Event, userId:number, eventId: number) :Promise<Event | boolean> {
  try {
    if (!eventId) {
      return false;
    }

    const isAdmin = await checkAdminController(userId);
    if (isAdmin) {
      const payload : Event = {
        ...eventData,
        updated_at: new Date().toISOString(),
        updated_by: userId
      };

      const fields = ['id', 'created_at', 'created_by', 'status', 'published_at', 'banner_image', 'slug',
        'updated_at', 'updated_by', 'meta_title', 'description', 'meta_description', 'location', 'primary_tag', 'event_time'];

      const data = await eventHandler.updateOneById(eventId, payload, fields);
      return data.rows[0] as Event;
    }
    throw {statusCode: 404, message: 'User has no admin access'};

  } catch (error) {
    throw error;
  }
}

export async function deleteEventController(eventId: number, userId: number) : Promise<boolean> {
  try {
    if (!eventId) {
      return false;
    }
    const isAdmin = await checkAdminController(userId);
    if (isAdmin) {
      await eventHandler.deleteOneById(eventId);
      return true;
    }
    throw {statusCode: 404, message: 'User has no admin access'};

  } catch (error) {
    throw error;
  }
}
