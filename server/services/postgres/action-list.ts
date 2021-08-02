import { Actions } from 'typings/service-actions.type';
import {createUser, deleteUser, getUser, updateUser, ValidateUser} from './users.service';

export const serviceActions: {[x in Actions]:any} = {
    'CREATE_USER': createUser,
    'GET_USER': getUser,
    'DELETE_USER': deleteUser,
    'UPDATE_USER': updateUser,
    'VALIDATE_USER': ValidateUser
};

