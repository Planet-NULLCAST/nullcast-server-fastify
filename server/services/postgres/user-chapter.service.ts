import { Client, QueryConfig } from 'pg';

import { UserChapterProgress, UserChapterProgressCount } from 'interfaces/user-chapter.type';
import { CHAPTER_TABLE, USER_CHAPTER_TABLE } from 'constants/tables';

export async function getUserChapterProgress(payload: UserChapterProgress):
Promise<UserChapterProgressCount> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getTotalChaptersCountQuery: QueryConfig = {
    name: 'get-total-user-chapter',
    text: `SELECT COUNT(id) FROM ${CHAPTER_TABLE} 
            WHERE course_id = $1;`,
    values: [payload.course_id]
  };

  const getCompletedChaptersCountQuery: QueryConfig = {
    name: 'get-completed-user-chapter',
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
