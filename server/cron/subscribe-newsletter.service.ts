import { SUBSCRIBER_TABLE } from '../constants/tables';
import mailer from '../lib/mailer';
import { Client, QueryConfig } from 'pg';
import initServices from '../initialize-services';


export async function sendMailForSubscribers() {
  await initServices();
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const sendMailForSubscribersQuery: QueryConfig = {
      text: `SELECT email 
        FROM ${SUBSCRIBER_TABLE};`
    };

    const queryData = await postgresClient.query(sendMailForSubscribersQuery);

    if (queryData.rows.length) {
      queryData.rows.map(async(userMail) => {
        const sender = await mailer.sendMail({
          from: 'Nullcast <connect@nullcast.io>',
          to: userMail.email,
          subject: 'Subscription Newsletter',
          // eslint-disable-next-line max-len
          text: `hi`
        });

        if (sender) {
          return true;
        }
        throw ({statusCode: 400, message: 'Sender error'});

      });
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
