import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { EVENT_REGISTER_TABLE } from 'constants/tables';
import { QueryParams } from 'interfaces/query-params.type';
import { EventRegister } from 'interfaces/event-register.type';


const eventRegisterHandler = new DatabaseHandler(EVENT_REGISTER_TABLE);

export async function createEventRegistrationController(
  eventRegisterData: EventRegister, userId:number): Promise<EventRegister> {

  const payload: EventRegister = {
    user_id: userId as number,
    event_id: eventRegisterData.event_id as number,
    email: eventRegisterData.email as string,
    full_name: eventRegisterData.full_name as string,
    created_by: userId as number
  };

  const fields = ['user_id', 'event_id', 'full_name', 'email', 'is_subscribed', 'created_by', 'created_at'];

  const data = await eventRegisterHandler.insertOne(payload, fields);

  return data.rows[0] as EventRegister;
}

export async function getEventAttendeeController(eventId: number, userId: number) {
  try {
    const payload = {
      event_id: eventId,
      user_id: userId
    };
    return await eventRegisterHandler.dbHandler('GET_EVENT_ATTENDEE', payload);
  } catch (error) {
    throw error;
  }
}

export async function getEventAttendeesController(eventId: number, qParams:QueryParams) {
  try {
    const payload = {
      event_id: eventId
    };
    return await eventRegisterHandler.dbHandler('GET_EVENT_ATTENDEES', payload, qParams);
  } catch (error) {
    throw error;
  }
}

export async function deleteEventAttendeeController(EventId: number, email: string) : Promise<boolean> {
  try {
    if (!(EventId && email)) {
      return false;
    }

    const payload = {
      event_id: EventId,
      user_id : email
    };

    await eventRegisterHandler.dbHandler('DELETE_EVENT_ATTENDEE', payload);
    return true;
  } catch (error) {
    throw error;
  }
}
