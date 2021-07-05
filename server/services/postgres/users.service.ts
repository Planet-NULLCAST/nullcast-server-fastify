import { Client } from "pg";
import { CreateUserQuery, ValidateUser, getUserQuery, User, UserStatus } from "typings/user.type";

export async function getUser(payload:{userName: string}):Promise<User> {
    const postgresClient:Client = (globalThis as any).postgresClient as Client;
    const data = await postgresClient.query<getUserQuery>(`
    SELECT user_name, full_name, email, created_at, updated_at,cover_image, bio, status 
    FROM users
    WHERE user_name = '${payload.userName}';`
    );

    if (data.rows && data.rows.length) {
        return {
            userName: data.rows[0]?.user_name as string,
            fullName: data.rows[0]?.full_name as string,
            email: data.rows[0]?.email as string,
            createdAt: data.rows[0]?.created_at as string,
            updatedAt: data.rows[0]?.updated_at  as string,
            bio: data.rows[0]?.bio  as string,
            status: data.rows[0]?.status  as UserStatus,
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
            WHERE user_name = '${payload.userName}' AND password = '${payload.password}'
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
            WHERE user_name = '${payload.userName}' AND password = '${payload.password}'
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
    await postgresClient.query<CreateUserQuery>(`
     INSERT INTO users (user_name, full_name, email,password, created_at, updated_at, cover_image, bio, status) VALUES (
        '${payload.userName}','${payload.fullName}', '${payload.email}', '${payload.password}', '${payload.createdAt}', '${payload.updatedAt}', '${payload.coverImage || ''}', '${payload.bio || ''}', '${payload.status || ''}'
     );`
     );

     return true;
    } catch(error) {
        throw error;
    }
}

export async function updateUser(payload: User): Promise<boolean> {
    const postgresClient:Client = (globalThis as any).postgresClient as Client;
    await postgresClient.query<getUserQuery>(`
        UPDATE users SET 
        full_name = '${payload.fullName}', email = '${payload.email}', updated_at = '${payload.updatedAt}', cover_image = '${payload.coverImage || ''}', bio = '${payload.bio || ''}', status = '${payload.status || ''}'
        WHERE user_name = '${payload.userName}'
    ;`)

    return true;
}