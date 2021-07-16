import postgresHandler from '../services/postgres/postgres.handler';
import { UserType } from '../route-schemas/users/user.schema'

export async function createUserController(userData: UserType): Promise<boolean> {
    try {
        const payload: UserType ={
            ...userData,
            username: userData.username.toLowerCase(),
            fullName: userData.fullName.toLowerCase(),
            email: userData.email.toLowerCase(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return await postgresHandler<UserType, boolean>('CREATE_USER', payload);
    } catch (error) {
        throw error;
    }
}

