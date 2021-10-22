import { USER_COURSE_TABLE } from 'constants/tables';
import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { TokenUser } from 'interfaces/user.type';
import { UpdateUserCourse, UserCourse } from 'interfaces/user-course.type';


const userCourseHandler = new DatabaseHandler(USER_COURSE_TABLE);

export async function enrolCourseController(userCourseData: UserCourse, user:TokenUser): Promise<UserCourse> {
  const payload: UserCourse = {
    ...userCourseData,
    user_id: user.id as number,
    created_by: user.id as number
  };

  const fields = ['id', 'user_id', 'course_id', 'status', 'created_by', 'created_at'];

  const data = await userCourseHandler.insertOne(payload, fields);

  return data.rows[0] as UserCourse;
}

export async function getUserCourseController(user_course_id: number): Promise<UserCourse> {
  try {
    const fields = ['id', 'user_id', 'course_id', 'status', 'created_by', 'created_at'];

    return await userCourseHandler.findOneById(user_course_id, fields) as UserCourse;
  } catch (error) {
    throw error;
  }
}

export async function updateUserCourseController(userCourseData:UpdateUserCourse, userCourseId:number, user: TokenUser)
:Promise<UserCourse | boolean> {
  try {
    if (!userCourseId) {
      return false;
    }
    const payload : UpdateUserCourse = {
      ...userCourseData,
      updated_at: new Date().toISOString(),
      updated_by: user.id as number
    };

    const fields = ['id', 'user_id', 'course_id', 'status', 'updated_by', 'updated_at'];

    const data = await userCourseHandler.updateOneById(userCourseId, payload, fields);
    return data.rows[0] as UserCourse;

  } catch (error) {
    throw error;
  }
}

export async function deleteUserCourseController(userCourseId: number) : Promise<boolean> {
  try {
    if (!userCourseId) {
      return false;
    }

    await userCourseHandler.deleteOneById(userCourseId);
    return true;
  } catch (error) {
    throw error;
  }
}