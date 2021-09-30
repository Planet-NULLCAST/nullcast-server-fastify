import { Chapter } from 'interfaces/chapter.type';
import { Client, QueryConfig } from 'pg';

export async function getChapter(payload: { chapterId: number }): Promise<Chapter> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getChapterQuery: QueryConfig = {
    name: 'get-chapter',
    text: `SELECT id, name, course_id, slug, chapter_no, created_by
        FROM course_chapters
        WHERE id = $1;`,
    values: [payload.chapterId]
  };

  const data = await postgresClient.query<Chapter>(getChapterQuery);

  if (data.rows && data.rows.length) {
    return  data.rows[0] as Chapter;
  }
  throw new Error('Chapter not found');
}
