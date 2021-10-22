import { Client, QueryConfig } from 'pg';

import { UserChapterProgress, UserChapterProgressCount } from 'interfaces/user-chapter.type';

export async function getUserChapterProgress(payload: UserChapterProgress):
Promise<UserChapterProgressCount> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getTotalChaptersCountQuery: QueryConfig = {
    name: 'get-total-user-chapter',
    text: `select count(id) from course_chapters where course_id = $1;`,
    values: [payload.course_id]
  };

  const getCompletedChaptersCountQuery: QueryConfig = {
    name: 'get-completed-user-chapter',
    text: `select count(chapter_id) from user_chapters where course_id= $1 AND user_id = $2;`,
    values: [payload.course_id, payload.user_id]
  };

  const total = await postgresClient.query(getTotalChaptersCountQuery);
  const completed = await postgresClient.query(getCompletedChaptersCountQuery);

  if (total.rows && total.rows.length && completed.rows && completed.rows.length) {
    return  {total: total.rows[0].count, completed: completed.rows[0].count} as UserChapterProgressCount;
  }
  throw new Error('Something error occurred');
}
