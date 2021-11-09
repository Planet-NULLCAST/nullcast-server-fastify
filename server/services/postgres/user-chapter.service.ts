import { Client, QueryConfig } from 'pg';

import { CHAPTER_TABLE, USER_CHAPTER_TABLE } from 'constants/tables';

import {
  UpdateUserChapter, UserChapter,
  UserChapterProgress, UserChapterProgressCount
}
  from 'interfaces/user-chapter.type';
import { TokenUser } from 'interfaces/user.type';


export async function getUserChapterProgress(payload: UserChapterProgress):
Promise<UserChapterProgressCount> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getTotalChaptersCountQuery: QueryConfig = {
    text: `SELECT COUNT(id) FROM ${CHAPTER_TABLE} 
            WHERE course_id = $1;`,
    values: [payload.course_id]
  };

  const getCompletedChaptersCountQuery: QueryConfig = {
    text: `SELECT COUNT(chapter_id) FROM ${USER_CHAPTER_TABLE} 
            WHERE course_id = $1 AND user_id = $2;`,
    values: [payload.course_id, payload.user_id]
  };

  const total = await postgresClient.query(getTotalChaptersCountQuery);
  const completed = await postgresClient.query(getCompletedChaptersCountQuery);

  if (total.rows && total.rows.length && completed.rows && completed.rows.length) {
    return  {total: total.rows[0].count, completed: completed.rows[0].count} as UserChapterProgressCount;
  }
  throw new Error('Something error occurred');
}

export async function getUserChapter(payload: {[x: string]: any}):
Promise<UserChapter> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getUserChapterQuery: QueryConfig = {
    text: `SELECT user_id, course_id, chapter_id, completed_at, created_by, created_at
            FROM user_chapters WHERE chapter_id = $1 AND user_id = $2;`,
    values: [payload.chapterId, payload.userId]
  };

  const data = await postgresClient.query(getUserChapterQuery);
  if (data.rows && data.rows.length) {
    return data.rows[0] as UserChapter;
  }
  throw new Error('Something error occurred');
}

export async function updateUserChapter(
  // eslint-disable-next-line no-empty-pattern
  payload: UpdateUserChapter, {}, user: TokenUser, otherConstraints: {[x: string]: any}):
Promise<UserChapter> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  let updateStatement = 'SET';
  const payloadArray = Object.entries(payload);

  const queryValues = [otherConstraints.chapterId, user.id];

  payloadArray.forEach(([key, value], index) => {
    queryValues.push(value);
    if (index !== payloadArray.length - 1) {
      updateStatement = `${updateStatement} ${key} = $${queryValues.length},`;
    } else {
      updateStatement = `${updateStatement} ${key} = $${queryValues.length}`;
    }
  });

  const fields = ['user_id', 'course_id', 'chapter_id', 'completed_at', 'updated_by', 'updated_at'];
  const returningStatement = `RETURNING ${fields.map((item) => item).join(', ')}`;

  const updateUserChapterQuery: QueryConfig = {
    text: `UPDATE user_chapters
            ${updateStatement}
            WHERE chapter_id = $1 AND user_id = $2
            ${returningStatement};`,
    values: queryValues
  };
  const data = await postgresClient.query(updateUserChapterQuery);
  if (data.rows && data.rows.length) {
    return data.rows[0] as UserChapter;
  }
  throw new Error('Something error occurred');
}

export async function deleteUserChapter(payload: {[x: string]: any}) {
  try {
    const postgresClient: Client = (globalThis as any).postgresClient as Client;

    const deleteUserChapterQuery: QueryConfig = {
      text: `DELETE FROM user_chapters
              WHERE chapter_id = $1 AND user_id = $2;`,
      values: [payload.chapterId, payload.userId]
    };
    return await postgresClient.query(deleteUserChapterQuery);
  } catch (err) {
    throw err;
  }
}
