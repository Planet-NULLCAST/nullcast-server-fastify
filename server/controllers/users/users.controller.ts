import { DatabaseHandler } from 'services/postgres/postgres.handler';
import {
  ValidateUser,
  ValidateResponse,
  User,
  UpdateUser,
  DeleteUser,
  cookieData
} from 'interfaces/user.type';
import { createHash, createRandomBytes } from '../../utils/hash-utils';

import {
  USER_TABLE, ENTITY_TABLE, BADGE_TABLE
} from '../../constants/tables';
import { issueToken } from 'utils/jwt.utils';

const userHandler = new DatabaseHandler(USER_TABLE);
const entityHandler = new DatabaseHandler(ENTITY_TABLE);
const badgeHandler = new DatabaseHandler(BADGE_TABLE);

export async function createUserController(userData: User): Promise<cookieData> {
  try {
    // const password = crypto.scryptSync(userData.password as string, process.env.SALT as string,64).toString('hex');
    const salt = createRandomBytes();
    const hashData = createHash(userData.password as string, salt);

    // Get entity_id and badge_id
    const ENTITY_NAME = 'nullcast';
    const BADGE_NAME = 'noob';

    const entity = await entityHandler.findOneByField({ name: ENTITY_NAME }, [
      'id'
    ]);
    const badge = await badgeHandler.findOneByField({ name: BADGE_NAME }, [
      'id'
    ]);

    const payload: User = {
      ...userData,
      entity_id: entity.id,
      salt: hashData.salt,
      password: hashData.password,
      primary_badge: badge.id,
      slug: userData.user_name.toLowerCase(),
      user_name: userData.user_name.toLowerCase(),
      full_name: userData.full_name.toLowerCase(),
      email: userData.email.toLowerCase()
    };

    await userHandler.insertOne(payload);
    const user = await userHandler.findOneByField({user_name: payload.user_name}, ['id', 'user_name', 'full_name']);
    // if create success.
    const token = issueToken({user_name: user.user_name, id: user.id});

    const loginData: cookieData = {
      token,
      user
    };

    return loginData ;
  } catch (error) {
    throw error;
  }
}

export async function getUserController(user_name: string): Promise<User> {
  try {
    return await userHandler.dbHandler<{ user_name: string }, User>('GET_USER', {
      user_name
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteUserController(
  userData: DeleteUser
): Promise<boolean> {
  try {
    const id = userData?.id as number;
    if (!id) {
      return false;
    }

    await userHandler.deleteOneById(id);
    return true;
  } catch (error) {
    throw error;
  }
}

export async function updateUserController(userData: User): Promise<boolean> {
  try {
    const id = userData?.id as number;
    if (!id) {
      return false;
    }

    const payload: UpdateUser = {
      user_name: userData.user_name.toLowerCase(),
      full_name: userData.full_name.toLowerCase(),
      slug: userData.user_name.toLowerCase(),
      email: userData.email.toLowerCase(),
      updated_at: new Date().toISOString()
    };
    await userHandler.updateOneById<UpdateUser>(id, payload);

    return true;
  } catch (error) {
    throw error;
  }
}

export async function validateUserController(userData: ValidateUser) {
  try {
    const dbData =  await userHandler.dbHandler<ValidateUser, ValidateResponse>(
      'VALIDATE_USER',
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
