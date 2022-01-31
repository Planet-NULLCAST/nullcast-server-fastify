import { USER_CHAPTER_TABLE } from 'constants/tables';
import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { TokenUser } from 'interfaces/user.type';
import {
  UpdateUserChapter, UserChapter, UserChapterProgress, UserChapterProgressCount
} from 'interfaces/user-chapter.type';


const UserChapterHandler = new DatabaseHandler(USER_CHAPTER_TABLE);

export async function createUserChapterController(
  userCourseData: UserChapter, user:TokenUser): Promise<UserChapter> {
  const payload: UserChapter = {
    ...userCourseData,
    user_id: user.id as number,
    created_by: user.id as number
  };

  const fields = ['user_id', 'course_id', 'chapter_id', 'completed_at', 'created_by', 'created_at'];

  const data = await UserChapterHandler.insertOne(payload, fields);

  return data.rows[0] as UserChapter;
}

export async function getUserChapterController(
  chapterId: number, userId: number): Promise<UserChapter> {
  try {
    const payload = {
      'chapterId': chapterId,
      'userId': userId
    };

    return await UserChapterHandler.dbHandler('GET_USER_CHAPTER', payload) as UserChapter;
  } catch (error) {
    throw error;
  }
}

export async function getUserChapterProgressController(
  userData: UserChapterProgress): Promise<UserChapterProgressCount> {
  try {

    return await UserChapterHandler.dbHandler('GET_USER_CHAPTER_PROGRESS', userData) as UserChapterProgressCount;
  } catch (error) {
    throw error;
  }
}

export async function updateUserChapterController(
  userCourseData:UpdateUserChapter, chapterId:number, user: TokenUser)
:Promise<UserChapter | boolean> {
  try {
    if (!chapterId) {
      return false;
    }
    const payload : UpdateUserChapter = {
      ...userCourseData,
      updated_at: new Date().toISOString(),
      updated_by: user.id as number
    };
    return await UserChapterHandler.dbHandler(
      'UPDATE_USER_CHAPTER', payload, {}, user, {'chapterId': chapterId}) as UserChapter;

  } catch (error) {
    throw error;
  }
}

export async function deleteUserChapterController(chapterId: number, userId: number) : Promise<boolean> {
  try {
    if (!chapterId) {
      return false;
    }

    const payload = {
      'chapterId': chapterId,
      'userId': userId
    };

    await UserChapterHandler.dbHandler('DELETE_USER_CHAPTER', payload);
    return true;
  } catch (error) {
    throw error;
  }
}
