import postgresHandler from '../services/postgres/postgres.handler';
import { UserType } from '../route-schemas/users/user.schema'

export async function createUserController(req: any): Promise<boolean> {
    try {
        const { body: userData } = req;
        
        const payload: UserType ={
            ...userData,
            userName: userData.userName.toLowerCase(),
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

