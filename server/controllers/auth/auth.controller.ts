import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { USER_TABLE } from '../../constants/tables';
import {
  ValidateUser, ValidateResponse, ValidateResetPassword,
  ResetPasswordPayload, ValidateUpdatePassword
} from 'interfaces/user.type';

import { verifyHash } from '../../utils/hash-utils';
import { issueToken, getTokenData } from 'utils/jwt.utils';
import { createHash } from 'utils/hash-utils';

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

    if (verifyHash(userData.password, dbData.password)) {

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


export async function resetPasswordController(userData: ValidateResetPassword) {
  try {

    const { token, password } = userData as ValidateResetPassword;

    const tokenData = getTokenData(token);
    if (tokenData && tokenData.email) {
      const hashData = createHash(password);
      const email = { key: 'email', value: tokenData.email as string };
      const dbData = await userHandler.dbHandler<ResetPasswordPayload, boolean>(
        'RESET_PASSWORD',
        { hashData, email }
      );
      if (dbData) {
        return true;
      }
      return false;
    }

    return false;
  } catch (error) {
    throw error;
  }
}

export async function updatePasswordController(userData: ValidateUpdatePassword) {
  try {
    const payload = {
      email: userData.email,
      user_name: userData.user_name
    };
    const dbData: ValidateResponse =  await userHandler.dbHandler(
      'SIGN_IN_USER',
      payload
    );

    if (!dbData) {
      throw ({statusCode: 404, message: 'User not found'});
    }

    if (verifyHash(userData.old_password, dbData.password)) {
      if (userData.old_password === userData.new_password) {
        throw ({statusCode: 404, message: 'New password cannot be same as the old password'});
      } else {
        const hashData = createHash(userData.new_password);
        const updateData = {
          id: dbData.id,
          password: hashData
        };
        const data = await userHandler.dbHandler('UPDATE_PASSWORD', updateData);
        return data;
      }
    } else {
      throw ({statusCode: 404, message: 'Password is wrong'});
    }
  } catch (error) {
    throw error;
  }
}
