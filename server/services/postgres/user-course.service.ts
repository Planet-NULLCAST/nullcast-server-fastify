import { USER_COURSE_TABLE } from 'constants/tables';
import { UpdateUserCourse, UserCourse } from 'interfaces/user-course.type';
import { TokenUser } from 'interfaces/user.type';
import { Client, QueryConfig } from 'pg';


export async function getUserCourse(payload: {[x: string]: any}):
Promise<UserCourse> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getUserCourseQuery: QueryConfig = {
    name: 'get-user-course',
    text: `SELECT user_id, course_id, status, created_by, created_at
            FROM ${USER_COURSE_TABLE}
            WHERE course_id = $1 AND user_id = $2;`,
    values: [payload.courseId, payload.userId]
  };
  const data = await postgresClient.query(getUserCourseQuery);
  if (data.rows && data.rows.length) {
    return data.rows[0] as UserCourse;
  }
  throw new Error('Something error occurred');
}

export async function updateUserCourse(
  // eslint-disable-next-line no-empty-pattern
  payload: UpdateUserCourse, {}, user: TokenUser, otherConstraints: {[x: string]: any}):
Promise<UserCourse> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  let updateStatement = 'SET';
  const payloadArray = Object.entries(payload);

  const queryValues = [otherConstraints.courseId, user.id];

  payloadArray.forEach(([key, value], index) => {
    queryValues.push(value);
    if (index !== payloadArray.length - 1) {
      updateStatement = `${updateStatement} ${key} = $${queryValues.length},`;
    } else {
      updateStatement = `${updateStatement} ${key} = $${queryValues.length}`;
    }
  });

  const fields = ['user_id', 'course_id', 'status', 'updated_by', 'updated_at'];
  const returningStatement = `RETURNING ${fields.map((item) => item).join(', ')}`;

  const updateUserCourseQuery: QueryConfig = {
    name: 'update-user-chapter',
    text: `UPDATE ${USER_COURSE_TABLE}
          ${updateStatement}
          WHERE course_id = $1 AND user_id = $2
          ${returningStatement};`,
    values: queryValues
  };
  const data = await postgresClient.query(updateUserCourseQuery);
  if (data.rows && data.rows.length) {
    return data.rows[0] as UserCourse;
  }
  throw new Error('Something error occurred');
}

export async function deleteUserCourse(payload: {[x: string]: any}) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const deleteUserCourseQuery: QueryConfig = {
      name: 'delete-user-chapter',
      text: `DELETE FROM ${USER_COURSE_TABLE}
              WHERE course_id = $1 AND user_id = $2;`,
      values: [payload.courseId, payload.userId]
    };
    return await postgresClient.query(deleteUserCourseQuery);
  } catch (err) {
    throw err;
  }
}
