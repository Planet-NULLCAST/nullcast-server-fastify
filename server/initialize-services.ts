import {Client} from 'pg';

async function connectPostgres(currentThis: any) {
  const client =  new Client(
    {
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABSE,
      port: parseInt(process.env.PG_PORT as unknown as string, 10)
    }
  );

  await client.connect();

  currentThis.postgresClient = client;
}


async function initServices() {
  try {
    // postgres
    await connectPostgres(globalThis);
  } catch (error) {
    throw error;
  }

}

export default initServices;
