import { Client, QueryConfig, QueryResult } from "pg";

export async function insertOne(
  tableName: string,
  payload: { [x: string]: any }
): Promise<QueryResult> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    // Construct columns , values and valueRefs for the prepared statement from the payload
    const columns: string = Object.keys(payload).join(", ");
    const values: string[] = Object.values(payload);
    const valueRefs: string = values
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    // Build the query text for prepared statement
    const text = `INSERT INTO ${tableName} (${columns}) VALUES (${valueRefs});`;

    const insertOneQuery: QueryConfig = {
      name: "insert-one",
      text,
      values: values,
    };

    return await postgresClient.query(insertOneQuery);

  } catch (error) {
    throw error;
  }
}

export async function insertMany(
  tableName: string,
  payload: [{ [x: string]: any }]
): Promise<QueryResult> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    // Find out the unique keys from the array of objects
    const uniqueKeys: string[] = Object.keys(Object.assign({}, ...payload));

    // Create an object with all the unique keys and keep their values as null
    const dummyValue = uniqueKeys.reduce((result: any, key) => {
      result[key] = null;
      return result;
    }, {});
    
    // store null as value to keys in object if there is inconsistency
    const data: any [] = payload.map(item => ({...dummyValue, ...item}))

    // Construct columns for the prepared statement from the payload
    const columns: string = uniqueKeys.join(", ");
    const valueRefArray: string[] = [];
    const values: any[] = [];

    let count = 0;

    // Construct both the values array and the valueref array
    data.forEach((record: { [x: string]: any }) => {
      const records: [] = Object.values(record) as [];
      let str = "(";

      records.forEach((value: any, index: number) => {
        // The string needed for the value ref array
        // All of the items in the string has to be distinct
        if (index !== records.length - 1) {
          str = str + `$${index + 1 + count}, `;
        } else {
          str = str + `$${index + 1 + count}`;
        }

        values.push(value);
      });

      str = str + ")";
      count = count + records.length;

      valueRefArray.push(str);
    });

    const valueRefs: string = valueRefArray.join(", ");

    // Build the query text for prepared statement
    const text = `INSERT INTO ${tableName} (${columns}) 
                    VALUES (${valueRefs});`;

    const query: QueryConfig = {
      name: "insert-many",
      text,
      values: values,
    };

    return await postgresClient.query(query);

  } catch (error) {
    throw error;
  }
}

export async function findOneById(
  tableName: string,
  id: number,
  attributes?: string[]
): Promise<QueryResult> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    // If no attributes are passed set the columns to *
    let columns: string = "*";

    // Construct columns for the prepared statement from the payload
    if (attributes && attributes.length) {
      columns = attributes.join(", ");
    }

    // Build the query text for prepared statement
    const text = `SELECT ${columns}
                    FROM ${tableName}
                    WHERE id = $1`;

    const query: QueryConfig = {
      name: "find-one-by-id",
      text,
      values: [id],
    };

    return await postgresClient.query(query);

  } catch (error) {
    throw error;
  }
}

export async function deleteOneById(
  tableName: string,
  id: number,
): Promise<QueryResult> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;


    // Build the query text for prepared statement
    const text = `DELETE FROM ${tableName} WHERE id = $1`;

    const query: QueryConfig = {
      name: "delete-one-by-id",
      text,
      values: [id],
    };

    return await postgresClient.query(query);

  } catch (error) {
    throw error;
  }
}



export async function updateOneById(
  tableName: string,
  id: number,
  payload: { [x: string]: any }
): Promise<QueryResult> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    let updateStatement = 'SET';
    const payloadArray = Object.entries(payload);
    
    payloadArray.forEach(([key, value], index) => {
      if (index !== payloadArray.length - 1) {
        updateStatement = updateStatement + ` ${key} = '${value}',`

      } else {
        updateStatement = updateStatement + ` ${key} = '${value}'`

      }
    })


    // Build the query text for prepared statement
    const text = `UPDATE ${tableName} ${updateStatement} WHERE id = $1`;

    const query: QueryConfig = {
      name: "update-one-by-id",
      text,
      values: [id],
    };

    
    return await postgresClient.query(query);

  } catch (error) {
    throw error;
  }
}


export async function findOneByField(
  tableName: string,
  payload: { [x: string]: any },
  attributes?: any[]
): Promise<QueryResult> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    // If no attributes are passed set the columns to *
    let columns: string = "*";

    // Construct columns for the prepared statement from the payload
    if (attributes && attributes.length) {
      columns = attributes.join(", ");
    }
    const [fieldName, fieldValue] = Object.entries(payload)[0] as string[];

    // Build the query text for prepared statement
    const text = `SELECT ${columns} FROM ${tableName} WHERE ${fieldName} = $1`;

    const query: QueryConfig = {
      name: "find-one-by-field",
      text,
      values: [fieldValue],
    };

    return await postgresClient.query(query);

  } catch (error) {
    throw error;
  }
}
