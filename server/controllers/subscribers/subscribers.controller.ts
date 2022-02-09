import { SUBSCRIBER_TABLE } from 'constants/tables';

import { QueryParams } from 'interfaces/query-params.type';
import { Subscriber } from 'interfaces/subscriber';

import { DatabaseHandler } from 'services/postgres/postgres.handler';


const subscriberHandler = new DatabaseHandler(SUBSCRIBER_TABLE);

export async function addSubscriberController(subscriptionData: Subscriber): Promise<Subscriber> {
  const payload : Subscriber = {
    email: subscriptionData.email as string
  };
  const fields = ['id', 'email', 'created_at', 'last_notified'];
  const data = await subscriberHandler.insertOne(payload, fields);
  return data.rows[0] as Subscriber;
}

export async function getSubscribersController(queryParams: QueryParams): Promise<Subscriber[]> {
  try {
    return await subscriberHandler.dbHandler('GET_SUBSCRIBERS', queryParams);
  } catch (error) {
    throw error;
  }
}

export async function deleteSubscriberController(email: string): Promise<boolean> {
  try {
    if (!email) {
      return false;
    }
    const payload = {
      email
    };
    await subscriberHandler.dbHandler('DELETE_SUBSCRIBER', payload);
    return true;
  } catch (error) {
    throw error;
  }
}
