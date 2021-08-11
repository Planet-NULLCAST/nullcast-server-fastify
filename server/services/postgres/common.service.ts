import { Client, QueryConfig } from "pg";

export async function insertOne(
  tableName: string,
  payload: { [x: string]: any }
): Promise<boolean> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const columns: string = Object.keys(payload).join(", ");
    const values: string[] = Object.values(payload);
    const valueRefs: string = values
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    const query = `INSERT INTO ${tableName} (${columns}) 
                    VALUES (${valueRefs});`;

    const insertOneQuery: QueryConfig = {
      name: "insert-one",
      text: query,
      values: values,
    };

    await postgresClient.query(insertOneQuery);

    return true;
  } catch (error) {
    throw error;
  }
}
