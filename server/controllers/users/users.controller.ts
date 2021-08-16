import jwt from 'jsonwebtoken';

import {DatabaseHandler} from 'services/postgres/postgres.handler';
import {
  ValidateUser, User, UpdateUser, DeleteUser
} from 'interfaces/user.type';
import {createHash} from '../../utils/hash-utils';

import {USER_TABLE} from '../../constants/tables';


const userHandler = new DatabaseHandler(USER_TABLE);
// const entityHandler = new DatabaseHandler(ENTITY_TABLE);
// const badgeHandler = new DatabaseHandler(BADGE_TABLE);


export async function createUserController(userData:User): Promise<string> {
  try {
    // const password = crypto.scryptSync(userData.password as string, process.env.SALT as string,64).toString('hex');
    const hashData = createHash(userData.password as string);
    console.log(hashData);

    // Get entity_id and badge_id
    // const EntityName = "nullcast";
    // const BadgeName = "noob";

    // const EntityId =  await entityHandler.findOneByField({name:EntityName}, ["id"]);
    // const BadgeId = await badgeHandler.findOneByField({name:BadgeName}, ["id"]);

    const EntityId = 10000000;
    const BadgeId = 10000000;


    const payload: User = {
      ...userData,
      entity_id: EntityId,
      salt: hashData.salt,
      password: hashData.password,
      primary_badge: BadgeId,
      slug: userData.slug,
      user_name: userData.user_name.toLowerCase(),
      full_name: userData.full_name.toLowerCase(),
      email: userData.email.toLowerCase()
    };

    await userHandler.insertOne(payload);
    // if create success.
    const token = jwt.sign({userName:payload.user_name, password:hashData.password}, process.env.JWT_KEY as string, {
      algorithm: 'HS256',
      expiresIn: parseInt(process.env.JWT_EXPIRY as string, 10)
    });
    return token;

  } catch (error) {
    throw error;
  }
}

export async function getUserController(userName: string): Promise<User> {
  try {
    return await userHandler.dbHandler<{userName:string}, User>('GET_USER', {userName});
  } catch (error) {
    throw error;
  }
}

export async function deleteUserController(userData: DeleteUser): Promise<boolean> {
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

export async function updateUserController(userData: User):Promise<boolean> {
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

export async function validateUserController(userData: ValidateUser): Promise<boolean> {
  try {
    return await userHandler.dbHandler<ValidateUser, boolean>('VALIDATE_USER', userData);
  } catch (error) {
    return false;

  }
}
