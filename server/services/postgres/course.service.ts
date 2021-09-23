import { Course } from 'interfaces/course.type';
import { Client, QueryConfig } from 'pg';

export async function getCourse(payload: { course_name: string }): Promise<Course> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getCourseQuery: QueryConfig = {
    name: 'get-user',
    text: `SELECT id, name, certificate_id, created_by
        FROM courses
        WHERE name = $1;`,
    values: [payload.course_name]
  };

  const data = await postgresClient.query<Course>(getCourseQuery);

  if (data.rows && data.rows.length) {
    return  data.rows[0] as Course;
  }
  throw new Error('Course not found');
}
