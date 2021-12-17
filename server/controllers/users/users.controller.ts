import { DatabaseHandler } from 'services/postgres/postgres.handler';
import {
  User,
  UpdateUser,
  cookieData
} from 'interfaces/user.type';
import { QueryParams } from 'interfaces/query-params.type';
import { createHash } from '../../utils/hash-utils';

import {
  USER_TABLE, ENTITY_TABLE, BADGE_TABLE, ROLE_TABLE, USER_ROLE_TABLE
} from '../../constants/tables';
import { getTokenData, issueToken } from 'utils/jwt.utils';

const userHandler = new DatabaseHandler(USER_TABLE);
const entityHandler = new DatabaseHandler(ENTITY_TABLE);
const badgeHandler = new DatabaseHandler(BADGE_TABLE);
const roleHandler = new DatabaseHandler(ROLE_TABLE);
const userRoleHandler = new DatabaseHandler(USER_ROLE_TABLE);

export async function createUserController(userData: User): Promise<cookieData> {
  try {
    const hashedPassword = createHash(userData.password as string);

    // Get entity_id and badge_id
    const ENTITY_NAME = 'nullcast';
    const BADGE_NAME = 'noob';
    const USER_ROLE_NAME = 'user';

    const entity = await entityHandler.findOneByField({ name: ENTITY_NAME }, [
      'id'
    ]);
    const badge = await badgeHandler.findOneByField({ name: BADGE_NAME }, [
      'id'
    ]);
    const randInt = Math.floor(Math.random() * 4);

    const payload: User = {
      entity_id: entity.id,
      password: hashedPassword,
      avatar: `/images/dummy${randInt}.png`,
      primary_badge: badge.id,
      slug: userData.user_name.split(' ').join('').toLowerCase(),
      user_name: userData.user_name.split(' ').join('').toLowerCase(),
      full_name: userData.full_name,
      email: userData.email.toLowerCase()
    };

    await userHandler.insertOne(payload);
    const fields = ['id', 'user_name', 'full_name', 'avatar'];
    const user = await userHandler.findOneByField({user_name: payload.user_name}, fields);
    // if create success.
    const userRole = await roleHandler.findOneByField({ name: USER_ROLE_NAME }, [
      'id'
    ]);
    const userRoleData = {
      role_id: userRole.id,
      user_id: user.id,
      created_at: new Date().toISOString(),
      created_by: user.id
    };
    await userRoleHandler.insertOne(userRoleData);
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

export async function verifyUserEmailController(userData: {token: string}) {
  try {

    const { token } = userData as {token: string};

    const tokenData = getTokenData(token);
    if (tokenData && tokenData.email) {
      const email = tokenData.email as string;
      const dbData = await userHandler.dbHandler(
        'VERIFY_USER_EMAIL',
        { email }
      );
      if (dbData) {
        return true;
      }
      return false;
    }
    throw ({statusCode: 401, message: 'Invalid Verification link'});
  } catch (error) {
    throw error;
  }
}

export async function updateUserController(userData: UpdateUser, userId: number): Promise<User|boolean> {
  try {
    if (!userId) {
      return false;
    }

    const payload: UpdateUser = {
      ...userData,
      updated_at: new Date().toISOString(),
      updated_by: userId
    };
    const fields = ['id', 'user_name', 'full_name', 'avatar'];

    const data = await userHandler.updateOneById<UpdateUser>(userId, payload, fields);

    return data.rows[0] as User;
  } catch (error) {
    throw error;
  }
}

export async function deleteUserController(
  userId: number
): Promise<boolean> {
  try {
    if (!userId) {
      return false;
    }

    await userHandler.deleteOneById(userId);
    return true;
  } catch (error) {
    throw error;
  }
}

export async function getUsersController(qParam:QueryParams): Promise<User> {
  try {
    return await userHandler.dbHandler<QueryParams, User>('GET_USERS', qParam);
  } catch (error) {
    throw error;
  }
}
