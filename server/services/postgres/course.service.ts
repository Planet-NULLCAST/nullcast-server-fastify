import { Client, QueryConfig } from 'pg';

import { Course, CourseChapter } from 'interfaces/course.type';

export async function getCourse(payload: { course_name: string }): Promise<Course> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getCourseQuery: QueryConfig = {
    name: 'get-course',
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

export async function addCoursesWithChapters(payload:CourseChapter) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const {chapters, ...coursePayload} = payload;

    // Construct columns for the prepared statement from the coursePayload
    const columns: string = Object.keys(coursePayload).join(', ');
    const values: string[] = Object.values(coursePayload);
    const valueRefs: string = values
      .map((_, index) => `$${index + 1}`)
      .join(', ');

    // Build the query text for prepared statement
    const text = `INSERT INTO courses (${columns}) 
                  VALUES (${valueRefs})
                  ON CONFLICT (name) DO UPDATE
                  set certificate_id = EXCLUDED.certificate_Id
                  RETURNING id, name, certificate_id;`;

    const courseQuery: QueryConfig = {
      text,
      values
    };
    const courseData = (await postgresClient.query(courseQuery)).rows[0];

    if (courseData && payload.chapters[0]) {

      const uniqueKeys: string[] = Object.keys(
        Object.assign({}, ...payload.chapters, {'course_id': courseData.id}));

      // Create an object with all the unique keys and keep their values as null
      const dummyValue = uniqueKeys.reduce((result: any, key) => {
        result[key] = null;
        return result;
      }, {});


      // store null as value to keys in object if there is inconsistency
      const data: any[] = payload.chapters.map((item) => (
        { ...dummyValue, ...item, 'course_id': courseData.id }));

      // Construct columns for the prepared statement from the payload
      const columns: string = uniqueKeys.join(', ');
      const valueRefArray: string[] = [];
      const values: any[] = [];

      let count = 0;

      // Construct both the values array and the valueref array
      data.forEach((record: { [x: string]: any }) => {
        const records: [] = Object.values(record) as [];
        let str = '(';

        records.forEach((value: any, index: number) => {
          // The string needed for the value ref array
          // All of the items in the string has to be distinct
          if (index !== records.length - 1) {
            str = `${str}$${index + 1 + count}, `;
          } else {
            str = `${str}$${index + 1 + count}`;
          }

          values.push(value);
        });

        str = `${str})`;
        count = count + records.length;

        valueRefArray.push(str);
      });

      const valueRefs: string = valueRefArray.join(', ');

      const text = `INSERT INTO course_chapters (${columns}) 
                    VALUES ${valueRefs}
                    ON CONFLICT ON CONSTRAINT course_chapter 
                    DO UPDATE
                    set chapter_no = EXCLUDED.chapter_no
                    RETURNING id, name, chapter_no, course_id;`;
      const chapterQuery: QueryConfig = {
        text,
        values
      };

      courseData.chapters = (await postgresClient.query(chapterQuery)).rows[0]
    }

    return courseData;
  } catch (error) {
    throw error;
  }
}
