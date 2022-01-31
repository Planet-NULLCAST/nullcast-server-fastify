import { CHAPTER_TABLE } from 'constants/tables';
import { Chapter } from 'interfaces/chapter.type';
import { Client, QueryConfig } from 'pg';

export async function getChapter(payload: { chapterName: string }): Promise<Chapter> {
  const postgresClient: Client = (globalThis as any).postgresClient as Client;

  const getChapterQuery: QueryConfig = {
    text: `SELECT id, name, course_id, slug, chapter_no, created_by
        FROM ${CHAPTER_TABLE}
        WHERE name = $1;`,
    values: [payload.chapterName]
  };

  const data = await postgresClient.query<Chapter>(getChapterQuery);

  if (data.rows && data.rows.length) {
    return  data.rows[0] as Chapter;
  }
  throw new Error('Chapter not found');
}
