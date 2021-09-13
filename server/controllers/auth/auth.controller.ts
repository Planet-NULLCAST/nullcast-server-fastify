import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { USER_TABLE } from '../../constants/tables';
import { ValidateUser, ValidateResponse } from "interfaces/user.type";
import { createHash } from '../../utils/hash-utils';
import { issueToken } from 'utils/jwt.utils';

const userHandler = new DatabaseHandler(USER_TABLE);

export async function signInUserController(userData: ValidateUser) {
    try {
      const dbData =  await userHandler.dbHandler<ValidateUser, ValidateResponse>(
        'SIGN_IN_USER',
        userData
      );
  
      if (!dbData) {
        return;
      }
  
      const hashData = createHash(userData.password, dbData.salt);
  
      if (dbData.password === hashData.password) {
        const user = {
          id: dbData.id,
          user_name: dbData.user_name,
          full_name: dbData.full_name
        };
        const token = issueToken({user_name: dbData.user_name, id: dbData.id});
  
        const cookieData = {
          user,
          token
        };
        return cookieData;
      }
      return;
    } catch (error) {
      throw error;
    }
  }