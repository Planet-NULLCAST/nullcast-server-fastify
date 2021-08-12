import jwt from 'jsonwebtoken';

import dbHandler, { DatabaseHandler } from 'services/postgres/postgres.handler';
import { ValidateUser, User} from "interfaces/user.type";
import { createHash } from '../../utils/hash-utils';

import { USER_TABLE } from '../../constants/tables'

const handler = new DatabaseHandler(USER_TABLE)

export async function createUserController(userData:User): Promise<string> {
    try {
        // const password = crypto.scryptSync(userData.password as string, process.env.SALT as string,64).toString('hex');
        const hashData = createHash(userData.password as string)
        console.log(hashData);

        // Get entity_idsadas

        const payload: User = {
            ...userData,
            password: hashData.password,
            user_name: userData.user_name.toLowerCase(),
            full_name: userData.full_name.toLowerCase(),
            email: userData.email.toLowerCase(),
        };

            await handler.insertOne(payload);
          // if create success.
          const token = jwt.sign({userName:payload.user_name, password:hashData.password}, process.env.JWT_KEY as string, {
            algorithm: 'HS256',
            expiresIn: parseInt(process.env.JWT_EXPIRY as string, 10)
          } );
          return token;

    } catch(error) {
        throw error;
    }
}

export async function getUserController(userName: string): Promise<User> {
    try {
        return await dbHandler.dbHandler<{userName:string},User>('GET_USER', {userName});
    } catch(error) {
        throw error;
    }
}

export async function deleteUserController(userData: ValidateUser): Promise<boolean> {
    try {
        return await dbHandler.dbHandler<ValidateUser,boolean>('DELETE_USER', userData);
    } catch (error) {
        throw error;
    }
}

export async function updateUserController(userData: User): Promise<boolean> {
    try {
        const payload: User = {
            ...userData,
            primary_badge: userData.primary_badge,
            entity_id: userData.entity_id,
            user_name: userData.user_name.toLowerCase(),
            full_name: userData.full_name.toLowerCase(),
            email: userData.email.toLowerCase(),
            updated_at: new Date().toISOString()
        };
        return await dbHandler.dbHandler<User,boolean>('UPDATE_USER', payload);
    } catch(error) {
        throw error;
    }
}

export async function validateUserController(userData: ValidateUser): Promise<boolean> {
    try {
        return await dbHandler.dbHandler<ValidateUser, boolean>('VALIDATE_USER', userData);
    } catch(error) {
        return false;
        
    }
}