import { USER_COURSE_TABLE } from 'constants/tables';
import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { TokenUser } from 'interfaces/user.type';
import { UpdateUserCourse, UserCourse } from 'interfaces/user-course.type';


const userCourseHandler = new DatabaseHandler(USER_COURSE_TABLE);

export async function enrolUserCourseController(userCourseData: UserCourse, user:TokenUser): Promise<UserCourse> {
  const payload: UserCourse = {
    ...userCourseData,
    user_id: user.id as number,
    created_by: user.id as number
  };

  const fields = ['user_id', 'course_id', 'status', 'created_by', 'created_at'];

  const data = await userCourseHandler.insertOne(payload, fields);

  return data.rows[0] as UserCourse;
}

export async function getUserCourseController(courseId: number, userId: number): Promise<UserCourse> {
  try {
    const payload = {
      'courseId': courseId,
      'userId': userId
    };

    return await userCourseHandler.dbHandler('GET_USER_COURSE', payload) as UserCourse;
  } catch (error) {
    throw error;
  }
}

export async function updateUserCourseController(userCourseData:UpdateUserCourse, courseId:number, user: TokenUser)
:Promise<UserCourse | boolean> {
  try {
    if (!courseId) {
      return false;
    }
    const payload : UpdateUserCourse = {
      ...userCourseData,
      updated_at: new Date().toISOString(),
      updated_by: user.id as number
    };

    return await userCourseHandler.dbHandler(
      'UPDATE_USER_COURSE', payload, {}, user, {'courseId': courseId}) as UserCourse;

  } catch (error) {
    throw error;
  }
}

export async function deleteUserCourseController(courseId: number, userId: number) : Promise<boolean> {
  try {
    if (!courseId) {
      return false;
    }

    const payload = {
      'courseId': courseId,
      'userId': userId
    };

    await userCourseHandler.dbHandler('DELETE_USER_COURSE', payload);
    return true;
  } catch (error) {
    throw error;
  }
}
