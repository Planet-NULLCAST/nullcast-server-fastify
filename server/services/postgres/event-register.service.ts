import { Client, QueryConfig } from 'pg';
import { EVENT_REGISTER_TABLE, USER_TABLE } from 'constants/tables';
import { QueryParams } from 'interfaces/query-params.type';


export async function getEventAttendee(payload: {event_id: number, user_id: number}) {

  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getEventAttendeeQuery: QueryConfig = {
    text: `SELECT er.user_id, er.event_id
            FROM ${EVENT_REGISTER_TABLE} AS er
            WHERE event_id = $1 AND user_id = $2;`,
    values: [payload.event_id, payload.user_id]
  };

  const data = await postgresClient.query(getEventAttendeeQuery);

  return data.rows[0];
}

export async function getEventAttendees(payload: {event_id: number}, queryParams: QueryParams) {
  const {
    page = 1,
    limit = 10,
    order = 'DESC',
    sort_field = 'created_at'
  } = queryParams;

  const queryValues: any = [payload.event_id];

  queryValues.push(+limit);
  queryValues.push((page - 1) * +limit);

  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getEventAttendeesQuery: QueryConfig = {
    text: `SELECT u.id, u.avatar, u.user_name, er.full_name, er.email
            FROM ${EVENT_REGISTER_TABLE} AS er
            JOIN ${USER_TABLE} AS u ON u.id = er.user_id
            WHERE event_id = $1
            ORDER BY 
            er.${sort_field} ${order}
            LIMIT $${queryValues.length-1}
            OFFSET $${queryValues.length};`,
    values: queryValues
  };

  const getEventAttendeesCountQuery: QueryConfig = {
    text: `SELECT COUNT(er.user_id)
            FROM ${EVENT_REGISTER_TABLE} AS er
            WHERE event_id = $1;`,
    values: queryValues.slice(0, -2)
  };

  const eventAttendeesData = await postgresClient.query(getEventAttendeesQuery);
  const countData = await postgresClient.query(getEventAttendeesCountQuery);

  return {users: eventAttendeesData.rows, ...countData.rows[0], limit, page};
}

export async function deleteEventAttendee(payload: {[x: string]: any}) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const deleteEventAttendeeQuery: QueryConfig = {
      text: `DELETE FROM 
              ${EVENT_REGISTER_TABLE}
              WHERE event_id = $1 AND email = $2;`,
      values: [payload.event_id, payload.email]
    };
    return await postgresClient.query(deleteEventAttendeeQuery);
  } catch (err) {
    throw err;
  }
}
