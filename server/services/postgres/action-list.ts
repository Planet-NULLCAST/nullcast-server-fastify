import { Actions, CommonActions } from 'interfaces/service-actions.type';
import {createUser, deleteUser, getUser, updateUser, ValidateUser} from './users.service';
import { insertOne } from './common.service'

export const serviceActions: {[x in Actions]:any} = {
    'CREATE_USER': createUser,
    'GET_USER': getUser,
    'DELETE_USER': deleteUser,
    'UPDATE_USER': updateUser,
    'VALIDATE_USER': ValidateUser,
};

export const commonActions: {[x in CommonActions]: any} = {
    'INSERT_ONE': insertOne
}
