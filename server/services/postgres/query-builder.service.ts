import {
  Client, QueryConfig, QueryResult, QueryResultRow
} from 'pg';

export async function deallocateStatement(
  statementName: string
): Promise<QueryResult> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  return postgresClient.query(`DEALLOCATE ${statementName};`);
}

export async function insertOne(
  tableName: string,
  payload: { [x: string]: any },
  fields?: string[]
): Promise<QueryResult> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    // Construct columns , values and valueRefs for the prepared statement from the payload
    const columns: string = Object.keys(payload).join(', ');
    const values: string[] = Object.values(payload);
    const valueRefs: string = values
      .map((_, index) => `$${index + 1}`)
      .join(', ');

    let returnStatement = '';
    if (fields) {
      returnStatement = `RETURNING ${fields.map((item) => item).join(', ')}`;
    }

    // Build the query text for prepared statement
    const text = `INSERT INTO ${tableName} (${columns}) 
                  VALUES (${valueRefs}) ${returnStatement};`;

    const insertOneQuery: QueryConfig = {
      text,
      values
    };

    return await postgresClient.query(insertOneQuery);
  } catch (error) {
    throw error;
  }
}

export async function insertMany(
  tableName: string,
  payload: any[],
  fields?: string[],
  uniqueField = 'id'
): Promise<QueryResult> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    let returnStatement = '';
    if (fields) {
      returnStatement = `RETURNING ${fields.map((item) => item).join(', ')}`;
    }

    // Find out the unique keys from the array of objects
    const uniqueKeys: string[] = Object.keys(Object.assign({}, ...payload));

    // Create an object with all the unique keys and keep their values as null
    const dummyValue = uniqueKeys.reduce((result: any, key) => {
      result[key] = null;
      return result;
    }, {});

    // store null as value to keys in object if there is inconsistency
    const data: any[] = payload.map((item) => ({ ...dummyValue, ...item }));

    // Construct columns for the prepared statement from the payload
    const columns: string = uniqueKeys.join(', ');
    const valueRefArray: string[] = [];
    const values: any[] = [];

    let count = 0;

    // Construct both the values array and the valueref array
    data.forEach((record: { [x: string]: any }) => {
      const records: [] = Object.values(record) as [];
      let str = '(';

      records.forEach((value: any, index: number) => {
        // The string needed for the value ref array
        // All of the items in the string has to be distinct
        if (index !== records.length - 1) {
          str = `${str}$${index + 1 + count}, `;
        } else {
          str = `${str}$${index + 1 + count}`;
        }

        values.push(value);
      });

      str = `${str})`;
      count = count + records.length;

      valueRefArray.push(str);
    });

    const valueRefs: string = valueRefArray.join(', ');

    let updateStatement = 'SET';
    uniqueKeys.forEach((key, index) => {
      if (index !== uniqueKeys.length - 1) {
        updateStatement = `${updateStatement} ${key} = EXCLUDED.${key},`;
      } else {
        updateStatement = `${updateStatement} ${key} = EXCLUDED.${key}`;
      }
    });

    // Build the query text for prepared statement
    const text = `INSERT INTO ${tableName} (${columns}) 
                  VALUES ${valueRefs}
                  ON CONFLICT (${uniqueField}) DO UPDATE
                  ${updateStatement}
                  ${returnStatement};`;

    const query: QueryConfig = {
      text,
      values
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
): Promise<QueryResultRow> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    // If no attributes are passed set the columns to *
    let columns = '*';

    // Construct columns for the prepared statement from the payload
    if (attributes && attributes.length) {
      columns = attributes.join(', ');
    }

    // Build the query text for prepared statement
    const text = `SELECT ${columns}
                    FROM ${tableName}
                    WHERE id = $1`;

    const query: QueryConfig = {
      text,
      values: [id]
    };

    return await (await postgresClient.query(query)).rows[0];
  } catch (error) {
    throw error;
  }
}

export async function deleteOneById(
  tableName: string,
  id: number
): Promise<QueryResult> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    // Build the query text for prepared statement
    const text = `DELETE FROM ${tableName} WHERE id = $1`;

    const query: QueryConfig = {
      text,
      values: [id]
    };

    return await postgresClient.query(query);
  } catch (error) {
    throw error;
  }
}

export async function updateOneById(
  tableName: string,
  id: number,
  payload: { [x: string]: any },
  fields?: string[]
): Promise<QueryResult> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    let updateStatement = 'SET';
    const payloadArray = Object.entries(payload);

    const queryValues = [id];

    payloadArray.forEach(([key, value], index) => {
      queryValues.push(value);
      if (index !== payloadArray.length - 1) {
        updateStatement = `${updateStatement} ${key} = $${queryValues.length},`;
      } else {
        updateStatement = `${updateStatement} ${key} = $${queryValues.length}`;
      }
    });

    let returnStatement = '';
    if (fields) {
      returnStatement = `RETURNING ${fields.map((item) => item).join(', ')}`;
    }

    // Build the query text for prepared statement
    const text = `UPDATE ${tableName} 
                  ${updateStatement} 
                  WHERE id = $1 
                  ${returnStatement};`;

    const query: QueryConfig = {
      text,
      values: queryValues
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
): Promise<QueryResultRow> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    // If no attributes are passed set the columns to *
    let columns = '*';

    // Construct columns for the prepared statement from the payload
    if (attributes && attributes.length) {
      columns = attributes.join(', ');
    }
    const [fieldName, fieldValue] = Object.entries(payload)[0] as string[];

    // Build the query text for prepared statement
    const text = `SELECT ${columns} FROM ${tableName} WHERE ${fieldName} = $1 LIMIT 1`;

    const query: QueryConfig = {
      text,
      values: [fieldValue]
    };

    return await (await postgresClient.query(query)).rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
