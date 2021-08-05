import postgresHandler from '../../services/postgres/postgres.handler';
import { ValidateUser, User } from "interfaces/user.type";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export async function createUserController(userData:User): Promise<string> {
    try {
        const password = crypto.scryptSync(userData.password as string, process.env.SALT as string,64).toString('hex');
        
        const payload: User = {
            ...userData,
            password,
            userName: userData.userName.toLowerCase(),
            fullName: userData.fullName.toLowerCase(),
            email: userData.email.toLowerCase(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

          await postgresHandler<User,boolean>('CREATE_USER', payload);
          // if create success.
          const token = jwt.sign({userName:payload.userName, password:password}, process.env.JWT_KEY as string, {
            algorithm: 'HS256',
            expiresIn: parseInt(process.env.JWT_EXPIRY as string)
          } );
          return token;

    } catch(error) {
        throw error;
    }
}

export async function getUserController(userName: string): Promise<User> {
    try {
        return await postgresHandler<{userName:string},User>('GET_USER', {userName});
    } catch(error) {
        throw error;
    }
}

export async function deleteUserController(userData: ValidateUser): Promise<boolean> {
    try {
        return await postgresHandler<ValidateUser,boolean>('DELETE_USER', userData);
    } catch (error) {
        throw error;
    }
}

export async function updateUserController(userData: User): Promise<boolean> {
    try {
        const payload: User = {
            ...userData,
            updatedAt: new Date().toISOString()
        };
        return await postgresHandler<User,boolean>('UPDATE_USER', payload);
    } catch(error) {
        throw error;
    }
}

export async function validateUserController(userData: ValidateUser): Promise<boolean> {
    try {
        return await postgresHandler<ValidateUser, boolean>('VALIDATE_USER', userData);
    } catch(error) {
        return false;
        
    }
}