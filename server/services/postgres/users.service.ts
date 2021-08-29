import { Client, QueryConfig } from 'pg';
import {
  CreateUserQuery,
  ValidateUser,
  User,
  UserStatus
} from 'interfaces/user.type';


export async function getUser(payload: { user_name: string }): Promise<User> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getUserQuery: QueryConfig = {
    name: 'get-user',
    text: `SELECT entity_id, user_name, full_name, email, created_at, updated_at,cover_image, bio, status, salt
        FROM users
        WHERE user_name = $1;`,
    values: [payload.user_name]
  };

  const data = await postgresClient.query<User>(getUserQuery);

  if (data.rows && data.rows.length) {
    return {
      user_name: data.rows[0]?.user_name as string,
      password: '',
      salt: data.rows[0]?.salt as string,
      full_name: data.rows[0]?.full_name as string,
      email: data.rows[0]?.email as string,
      created_at: data.rows[0]?.created_at as string,
      updated_at: data.rows[0]?.updated_at as string,
      bio: data.rows[0]?.bio as string,
      status: data.rows[0]?.status as UserStatus,
      slug: data.rows[0]?.slug as string,
      primary_badge: data.rows[0]?.primary_badge as number
    };
  }
  throw new Error('User not found');
}

export async function deleteUser(payload: ValidateUser): Promise<boolean> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const DeleteUserQuery: QueryConfig = {
      name: 'delete-user',
      text: `DELETE FROM users WHERE user_name = $1;`,
      values: [payload.user_name]
    };

    await postgresClient.query<User>(DeleteUserQuery);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function validateUser(payload: ValidateUser) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const ValidateUserQuery: QueryConfig = {
      name: 'validate-user',
      text: `SELECT id, email, user_name, password, salt, full_name FROM users 
      WHERE (user_name = $1)
      OR (email = $1)`,
      values: [payload.email]
    };

    const queryData = await postgresClient.query<ValidateUser>(
      ValidateUserQuery
    );

    if (queryData.rows.length) {
      return queryData.rows[0];
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function createUser(payload: User): Promise<boolean> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const CreateUserQuery: QueryConfig = {
      name: 'create-user',
      text: `INSERT INTO users 
            (entity_id, primary_badge, slug, user_name, full_name, email,password,
               created_at, updated_at, cover_image, bio, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      values: [
        payload.entity_id,
        payload.primary_badge,
        payload.slug,
        payload.user_name,
        payload.full_name,
        payload.email,
        payload.password,
        payload.created_at,
        payload.updated_at,
        payload.cover_image || '',
        payload.bio || '',
        payload.status || ''
      ]
    };

    await postgresClient.query<CreateUserQuery>(CreateUserQuery);

    return true;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(payload: User): Promise<boolean> {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const UpdateUserQuery: QueryConfig = {
      name: 'update-user',
      text: `UPDATE users 
            SET entity_id = $1, primary_badge = $2, slug = $3, full_name = $4, email = $5, 
              created_at = $6, updated_at = $7, cover_image = $8, bio = $9, status = $10
            WHERE user_name = $11`,
      values: [
        payload.entity_id,
        payload.primary_badge,
        payload.slug,
        payload.full_name,
        payload.email,
        payload.created_at,
        payload.updated_at,
        payload.cover_image || '',
        payload.bio || '',
        payload.status || '',
        payload.user_name
      ]
    };

    await postgresClient.query<User>(UpdateUserQuery);

    return true;
  } catch (error) {
    throw error;
  }
}
