import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { USER_TABLE } from '../../constants/tables';
import { ValidateUser, ValidateResponse, ValidateResetPassword, ResetPasswordPayload } from 'interfaces/user.type';
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
      const email = { key: 'enail', value: tokenData.email as string };
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
