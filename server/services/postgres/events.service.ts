import { EVENT_TABLE } from 'constants/tables';
import { Event } from 'interfaces/event.type';
import { QueryParams } from 'interfaces/query-params.type';
import { Client, QueryConfig } from 'pg';

export async function getEvents(queryParams: QueryParams) {
  try {
    const DEFAULT_FIELDS = ['id', 'title', 'guest_name', 'guest_designation', 'guest_image', 'registration_link', 'guest_bio', 'created_at', 'created_by',
    'status', 'published_at', 'banner_image', 'updated_at', 'meta_title', 'description', 'location', 'primary_tag', 'event_time'];

    const {
      limit_fields = DEFAULT_FIELDS,
      search = '',
      page = 1,
      limit = 10,
      status = '',
      order = 'ASC',
      sort_field = 'created_at'
    } = queryParams;

    let WHERE_CLAUSE = '';
    const queryValues: any[] = [];

    if (status) {
      queryValues.push(status);
      WHERE_CLAUSE = `WHERE events.status = $${queryValues.length}`;
    }

    if (search) {
      queryValues.push(`%${search}%`);
      if (status) {
        WHERE_CLAUSE = `${WHERE_CLAUSE} 
        AND (events.meta_title LIKE $${queryValues.length} 
        OR events.meta_description LIKE $${queryValues.length} 
        OR events.custom_excerpt LIKE $${queryValues.length})`;
      } else {
        WHERE_CLAUSE = `WHERE
        (events.meta_title LIKE $${queryValues.length} 
        OR events.meta_description LIKE $${queryValues.length} 
        OR events.custom_excerpt LIKE $${queryValues.length})`;
      }
    }
    queryValues.push(+limit);
    queryValues.push((page - 1) * +limit);

    const limitFields = limit_fields.map((item) => `events.${item}`);

    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const getEventsQuery: QueryConfig = {
      text: `SELECT ${limitFields}
              FROM ${EVENT_TABLE} AS events
              ${WHERE_CLAUSE}
              ORDER BY 
              events.${sort_field} ${order}
              LIMIT $${queryValues.length-1}
              OFFSET $${queryValues.length};`,
      values: queryValues
    };

    const getEventsCountQuery: QueryConfig = {
      text: `SELECT COUNT(events.id)
              FROM ${EVENT_TABLE} AS events
              ${WHERE_CLAUSE};`,
      values: queryValues.slice(0, -2)
    };

    const eventData = await postgresClient.query<Event>(getEventsQuery);
    const eventCountData = await postgresClient.query<Event>(getEventsCountQuery);

    if (eventData.rows && eventData.rows.length) {
      return  { events: eventData.rows, ...eventCountData.rows[0], limit, page };
    }
    return null;
  } catch (err) {
    throw err;
  }
}

export async function getEventsByUserId(payload: {userId: number}, queryParams: QueryParams) {

  const DEFAULT_FIELDS = ['id', 'title', 'guest_name', 'guest_designation', 'guest_image', 'registration_link', 'guest_bio', 'created_at', 'created_by',
    'status', 'published_at', 'banner_image', 'updated_at', 'meta_title', 'description', 'location', 'primary_tag', 'event_time'];

  const {
    limit_fields = DEFAULT_FIELDS,
    search = '',
    page = 1,
    limit = 10,
    status = '',
    order = 'ASC',
    sort_field = 'created_at'
  } = queryParams;

  let WHERE_CLAUSE = 'WHERE events.user_id = $1';

  const queryValues: any[] = [payload.userId];

  if (status) {
    queryValues.push(status);
    WHERE_CLAUSE = `${WHERE_CLAUSE} AND events.status = $${queryValues.length}`;
  }

  if (search) {
    queryValues.push(`%${search}%`);
    WHERE_CLAUSE = `${WHERE_CLAUSE} 
        AND (events.meta_title LIKE $${queryValues.length} 
        OR events.meta_description LIKE $${queryValues.length} 
        OR events.custom_excerpt LIKE $${queryValues.length})`;
  }
  const limitFields = limit_fields.map((item) => `events.${item}`);

  queryValues.push(+limit);
  queryValues.push((page - 1) * +limit);

  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getEventsByUserIdQuery: QueryConfig = {
    text: `SELECT ${limitFields}
            FROM ${EVENT_TABLE} AS events
            ${WHERE_CLAUSE}
            ORDER BY 
            events.${sort_field} ${order}
            LIMIT $${queryValues.length-1}
            OFFSET $${queryValues.length};`,
    values: queryValues
  };

  const getEventsByUserIdCountQuery: QueryConfig = {
    text: `SELECT COUNT(events.id)
            FROM ${EVENT_TABLE} AS events
            ${WHERE_CLAUSE};`,
    values: queryValues.slice(0, -2)
  };

  const eventData = await postgresClient.query<Event>(getEventsByUserIdQuery);
  const eventCountData = await postgresClient.query<Event>(getEventsByUserIdCountQuery);

  if (eventData.rows && eventData.rows.length) {
    return  { events: eventData.rows, ...eventCountData.rows[0], limit, page };
  }
  throw new Error('Events not found');
}
