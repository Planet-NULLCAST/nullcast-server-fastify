import {DatabaseHandler} from 'services/postgres/postgres.handler';
import { EVENT_TABLE } from 'constants/tables';
import { Event } from 'interfaces/event.type';
import { QueryParams } from 'interfaces/query-params.type';


const eventHandler = new DatabaseHandler(EVENT_TABLE);

export async function createEventController(eventData:Event, userId:number): Promise<Event> {
  try {

    const payload : Event = {
      meta_title: eventData.meta_title,
      description: eventData.description,
      slug: eventData.slug,
      banner_image: eventData.banner_image,
      created_by: userId,
      user_id: userId
    };

    const fields = ['id', 'created_at', 'created_by', 'status', 'published_at', 'banner_image',
      'updated_at', 'meta_title', 'description', 'location', 'primary_tag', 'event_time'];

    const data = await eventHandler.insertOne(payload, fields);
    return data.rows[0] as Event;

  } catch (error) {
    throw error;
  }
}

export async function getEventController(eventId:number):Promise<Event> {
  try {
    const fields = ['id', 'created_at', 'created_by', 'status', 'published_at', 'banner_image',
      'updated_at', 'meta_title', 'description', 'location', 'primary_tag', 'event_time'];

    return await eventHandler.findOneById(eventId, fields);

  } catch (error) {
    throw error;
  }
}

export async function getEventsByUserIdController(queryParams:QueryParams, userId:number):Promise<Event> {
  try {
    const payload: {userId: number} = {userId};

    return await eventHandler.dbHandler('GET_EVENTS', payload, queryParams);

  } catch (error) {
    throw error;
  }
}

export async function updateEventController(eventData:Event, userId:number, eventId: number) :Promise<Event | boolean> {
  try {
    if (!eventId) {
      return false;
    }
    const payload : Event = {
      ...eventData,
      updated_at: new Date().toISOString(),
      updated_by: userId
    };

    const fields = ['id', 'created_at', 'created_by', 'status', 'published_at', 'banner_image',
      'updated_at', 'updated_by', 'meta_title', 'description', 'location', 'primary_tag', 'event_time'];

    const data = await eventHandler.updateOneById(eventId, payload, fields);
    return data.rows[0] as Event;

  } catch (error) {
    throw error;
  }
}

export async function deleteEventController(eventId: number) : Promise<boolean> {
  try {
    if (!eventId) {
      return false;
    }

    await eventHandler.deleteOneById(eventId);
    return true;
  } catch (error) {
    throw error;
  }
}
