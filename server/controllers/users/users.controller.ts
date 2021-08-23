import { DatabaseHandler } from 'services/postgres/postgres.handler';
import {
  ValidateUser,
  ValidateResponse,
  User,
  UpdateUser,
  DeleteUser
} from 'interfaces/user.type';
import { createHash, createRandomBytes } from '../../utils/hash-utils';

import {
  USER_TABLE, ENTITY_TABLE, BADGE_TABLE
} from '../../constants/tables';
import { issueToken } from 'utils/jwt.utils';

const userHandler = new DatabaseHandler(USER_TABLE);
const entityHandler = new DatabaseHandler(ENTITY_TABLE);
const badgeHandler = new DatabaseHandler(BADGE_TABLE);

export async function createUserController(userData: User): Promise<string> {
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
    console.log('entity', entity);
    const badge = await badgeHandler.findOneByField({ name: BADGE_NAME }, [
      'id'
    ]);

    console.log(badge);

    const payload: User = {
      ...userData,
      entity_id: entity.id,
      salt: hashData.salt,
      password: hashData.password,
      primary_badge: badge.id,
      slug: userData.slug,
      user_name: userData.user_name.toLowerCase(),
      full_name: userData.full_name.toLowerCase(),
      email: userData.email.toLowerCase()
    };

    await userHandler.insertOne(payload);
    // if create success.
    const token = issueToken({user_name: payload.user_name});
    return token;
  } catch (error) {
    throw error;
  }
}

export async function getUserController(userName: string): Promise<User> {
  try {
    return await userHandler.dbHandler<{ userName: string }, User>('GET_USER', {
      userName
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
      slug: userData.slug,
      email: userData.email.toLowerCase(),
      updated_at: new Date().toISOString()
    };
    await userHandler.updateOneById<UpdateUser>(id, payload);

    return true;
  } catch (error) {
    throw error;
  }
}

export async function validateUserController(
  userData: ValidateUser
) {
  try {
    const dbData =  await userHandler.dbHandler<ValidateUser, ValidateResponse>(
      'VALIDATE_USER',
      userData
    );

    if (!dbData) {
      return 'Invalid Username or Password';
    }

    const hashData = createHash(userData.password, dbData.salt);

    if (dbData.password === hashData.password) {
      const token = issueToken({dbData});
      return { 'token': token };
    }
    return 'Invalid Username or Password';
  } catch (error) {
    throw error;
  }
}
