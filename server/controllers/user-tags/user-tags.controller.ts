import { USER_TAG_TABLE } from 'constants/tables';
import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { TokenUser } from 'interfaces/user.type';
import { UpdateUserTag, UserTag } from 'interfaces/user-tag.type';
import { QueryParams } from 'interfaces/query-params.type';


const userTagHandler = new DatabaseHandler(USER_TAG_TABLE);

export async function createUserTagController(userTagData: UserTag, user:TokenUser): Promise<UserTag> {
  const payload: UserTag = {
    tag_id: userTagData.tag_id as number,
    user_id: user.id as number,
    created_by: user.id as number
  };

  const fields = ['tag_id', 'user_id', 'created_by', 'created_at'];

  const data = await userTagHandler.insertOne(payload, fields);

  return data.rows[0] as UserTag;
}

export async function getUserTagsByUserIdController(queryParams:QueryParams, userId:number):Promise<Event> {
  try {
    const payload = {
      'userId': userId
    };

    return await userTagHandler.dbHandler('GET_USER_TAGS_BY_USER_ID', payload, queryParams);

  } catch (error) {
    throw error;
  }
}

export async function updateUserTagController(userTagData:UpdateUserTag, tagId:number, user: TokenUser)
:Promise<UserTag | boolean> {
  try {
    if (!tagId) {
      return false;
    }
    const payload : UpdateUserTag = {
      ...userTagData
    };
    if (Object.keys(payload)) {
      throw new Error("Nothing updated");
    }

    return await userTagHandler.dbHandler(
      'UPDATE_USER_TAG', payload, {}, user, {'tagId': tagId}) as UserTag;

  } catch (error) {
    throw error;
  }
}

export async function deleteUserTagController(tagId: number, userId: number) : Promise<boolean> {
  try {
    if (!tagId) {
      return false;
    }

    const payload = {
      'tagId': tagId,
      'userId': userId
    };

    await userTagHandler.dbHandler('DELETE_USER_TAG', payload);
    return true;
  } catch (error) {
    throw error;
  }
}
