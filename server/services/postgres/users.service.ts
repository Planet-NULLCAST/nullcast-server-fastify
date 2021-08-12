import { Client, QueryConfig } from "pg";
import { CreateUserQuery, ValidateUser, User, UserStatus } from "interfaces/user.type";

export async function getUser(payload:{userName: string}):Promise<User> {
    const postgresClient:Client = (globalThis as any).postgresClient as Client;

    const getUserQuery:QueryConfig = {
        name: 'get-user',
        text: `SELECT user_name, full_name, email, created_at, updated_at,cover_image, bio, status
        FROM users
        WHERE user_name = $1;`,
        values: [payload.userName]
    }
    
    const data = await postgresClient.query<User>(getUserQuery);

    if (data.rows && data.rows.length) {
        return {
            user_name: data.rows[0]?.user_name as string,
            password: '',
            salt: '',
            full_name: data.rows[0]?.full_name as string,
            email: data.rows[0]?.email as string,
            created_at: data.rows[0]?.created_at as string,
            updated_at: data.rows[0]?.updated_at  as string,
            bio: data.rows[0]?.bio  as string,
            status: data.rows[0]?.status  as UserStatus,
            slug: data.rows[0]?.slug as string,
            primary_badge:data.rows[0]?.primary_badge as string
        }
    } else {
        throw new Error("User not found");
    }

}

export async function deleteUser(payload: ValidateUser): Promise<boolean> {
    try {
        const postgresClient:Client = (globalThis as any).postgresClient as Client;

        await postgresClient.query(`
            DELETE FROM users
            WHERE user_name = '${payload.user_name}' AND password = '${payload.password}'
        ;`)
    
        return true;
    } catch(error) {
        console.error(error);
        return false;
    }
}

export async function ValidateUser(payload: ValidateUser): Promise<boolean> {
    try {
        const postgresClient:Client = (globalThis as any).postgresClient as Client;

        const queryData = await postgresClient.query(`
            SELECT user_name, password
            FROM users
            WHERE user_name = '${payload.user_name}' AND password = '${payload.password}'
        ;`)
    
        if(queryData.rows.length) {
            return true
        } else {
            return false;
        }
        
        
    } catch(error) {
        console.error(error);
        return false;
    }
} 

export async function createUser(payload: User): Promise<boolean> {
    try {
    const postgresClient:Client = (globalThis as any).postgresClient as Client;

    const createUser:QueryConfig = {
        name: 'create-user',
        text: `INSERT INTO users (entity_id, user_name, full_name, email,password, slug, primary_badge) VALUES (
            $1, $2, $3, $4, $5, $6, $7
        );`,
        values: [payload.entity_id, payload.user_name, payload.full_name, payload.email, payload.password, payload.slug, payload.primary_badge]
    }
    await postgresClient.query<CreateUserQuery>(createUser)

     return true;
    } catch(error) {
        throw error;
    }
}

export async function updateUser(payload: User): Promise<boolean> {
    const postgresClient:Client = (globalThis as any).postgresClient as Client;
    await postgresClient.query<User>(`
        UPDATE users SET 
        full_name = '${payload.full_name}', email = '${payload.email}', updated_at = '${payload.updated_at}', cover_image = '${payload.cover_image || ''}', bio = '${payload.bio || ''}', status = '${payload.status || ''}'
        WHERE user_name = '${payload.user_name}'
    ;`)

    return true;
}