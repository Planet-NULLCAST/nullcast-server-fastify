import {Actions} from 'interfaces/service-actions.type';
import {
  createUser, deleteUser, getUser, updateUser, ValidateUser
} from './users.service';
import { getPosts } from './posts.service';
import * as commonService from './query-builder.service';

export const serviceActions: {[x in Actions]:any} = {
  'CREATE_USER': createUser,
  'GET_USER': getUser,
  'DELETE_USER': deleteUser,
  'UPDATE_USER': updateUser,
  'VALIDATE_USER': ValidateUser,
  'GET_POSTS': getPosts
};

export const commonActions = {
  'INSERT_ONE': commonService.insertOne,
  'FIND_BY_ID': commonService.findOneById,
  'INSERT_MANY': commonService.insertMany,
  'DELETE_BY_ID': commonService.deleteOneById,
  'UPDATE_BY_ID': commonService.updateOneById,
  'FIND_ONE_BY_FIELD': commonService.findOneByField
};
