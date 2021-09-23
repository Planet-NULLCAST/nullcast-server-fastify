import { Course, UpdateCourse } from 'interfaces/course.type';
import { COURSE_TABLE } from 'constants/tables';
import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { TokenUser } from 'interfaces/user.type';


const courseHandler = new DatabaseHandler(COURSE_TABLE);

export async function createCourseController(courseData: Course, user:TokenUser): Promise<Course> {
  const payload: Course = {
    ...courseData,
    name: courseData.name.toLowerCase() as string,
    created_by: user.id as number
  };

  const fields = ['id', 'name', 'certificate_id', 'created_by', 'created_at'];

  const data = await courseHandler.insertOne(payload, fields);

  return data.rows[0] as Course;
}

export async function getCourseController(course_name: string): Promise<Course> {
  try {
    return await courseHandler.dbHandler<{ course_name: string }, Course>('GET_COURSE', {
      course_name
    });
  } catch (error) {
    throw error;
  }
}

export async function updateCourseController(courseData:UpdateCourse, courseId:number, user: TokenUser)
:Promise<Course | boolean> {
  try {
    if (!courseId) {
      return false;
    }
    const payload : UpdateCourse = {
      ...courseData,
      updated_at: new Date().toISOString(),
      updated_by: user.id as number
    };

    const fields = ['id', 'name', 'certificate_id', 'updated_by', 'updated_at'];

    const data = await courseHandler.updateOneById(courseId, payload, fields);
    return data.rows[0] as Course;

  } catch (error) {
    throw error;
  }
}

export async function deleteCourseController(courseId: number) : Promise<boolean> {
  try {
    if (!courseId) {
      return false;
    }

    await courseHandler.deleteOneById(courseId);
    return true;
  } catch (error) {
    throw error;
  }
}
