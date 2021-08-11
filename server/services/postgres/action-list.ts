import { Actions, CommonActions } from 'interfaces/service-actions.type';
import {createUser, deleteUser, getUser, updateUser, ValidateUser} from './users.service';
import { insertOne, insertMany , findOneById } from './query-builder.service'

export const serviceActions: {[x in Actions]:any} = {
    'CREATE_USER': createUser,
    'GET_USER': getUser,
    'DELETE_USER': deleteUser,
    'UPDATE_USER': updateUser,
    'VALIDATE_USER': ValidateUser,
};

export const commonActions: {[x in CommonActions]: any} = {
    'INSERT_ONE': insertOne,
    'FIND_BY_ID': findOneById,
    'INSERT_MANY': insertMany
}
