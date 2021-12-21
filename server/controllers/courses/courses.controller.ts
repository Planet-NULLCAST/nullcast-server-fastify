import {
  Course, CourseChapter, CourseChapterStructure, UpdateCourse
} from 'interfaces/course.type';
import { CERTIFICATE_TABLE, COURSE_TABLE } from 'constants/tables';
import { DatabaseHandler } from 'services/postgres/postgres.handler';
import { TokenUser } from 'interfaces/user.type';


const courseHandler = new DatabaseHandler(COURSE_TABLE);
const certificateHandler = new DatabaseHandler(CERTIFICATE_TABLE);

export async function createCourseController(courseData: Course, user:TokenUser): Promise<Course> {
  const payload: Course = {
    ...courseData,
    name: courseData.name.toLowerCase() as string,
    slug: courseData.name.toLowerCase().replace(/ /g, '-') as string,
    created_by: user.id as number
  };

  const fields = ['id', 'name', 'certificate_id', 'created_by', 'created_at'];

  const data = await courseHandler.insertOne(payload, fields);

  return data.rows[0] as Course;
}

export async function addCoursesController(courseData: Course[], user: TokenUser): Promise<Course> {
  for (const course of courseData) {
    course.name = course.name.toLowerCase();
    course.slug = course.name.toLowerCase().replace(/ /g, '-') as string;
    course.created_by = user.id;
  }

  const payload: Course[] = courseData;

  const fields = ['id', 'name', 'certificate_id', 'created_by', 'created_at'];
  const uniqueField = 'name';

  const data = await courseHandler.insertMany(payload, fields, uniqueField);

  return data.rows[0];
}

export async function addCoursesWithChaptersController(
  courseData: CourseChapterStructure[], user: TokenUser): Promise<CourseChapter[]> {

  const certificate = await certificateHandler.findOneByField(
    { name: 'nullcast' },
    ['id']
  );
  for (const course of courseData) {
    course.name = course.courseName?.toLowerCase() as string;
    course.slug = course.courseUrl as string;
    course.created_by = user.id as number;
    course.certificate_id = certificate.id as number;

    delete course.courseName;
    delete course.courseUrl;
    delete course.courseId;
    for (const chapter of course.chapters) {

      chapter.name = chapter.chapterName?.toLowerCase() as string;
      chapter.slug = chapter.chapterUrl as string;
      chapter.chapter_no = chapter.chapterId as number;
      chapter.created_by = user.id as number;

      delete chapter.chapterName;
      delete chapter.chapterUrl;
      delete chapter.chapterId;
    }
  }

  const payload = courseData as CourseChapter[];

  const data:CourseChapter[] = [];
  for (const item of payload) {
    data.push(await courseHandler.dbHandler('ADD_COURSE_CHAPTERS', item));
  }

  return data as CourseChapter[];
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
