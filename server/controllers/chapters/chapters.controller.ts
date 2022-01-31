import { CHAPTER_TABLE, COURSE_TABLE } from 'constants/tables';
import { Chapter, UpdateChapter } from 'interfaces/chapter.type';
import { TokenUser } from 'interfaces/user.type';
import { DatabaseHandler } from 'services/postgres/postgres.handler';


const chapterHandler = new DatabaseHandler(CHAPTER_TABLE);
const courseHandler = new DatabaseHandler(COURSE_TABLE);


export async function createChapterController(chapterData: Chapter, user:TokenUser): Promise<Chapter> {
  let course;
  if (chapterData.course_name) {
    course = await courseHandler.findOneByField({ name: chapterData.course_name.toLowerCase() },
      ['id']);
    delete chapterData.course_name;
  }

  const payload: Chapter = {
    ...chapterData,
    name: chapterData.name.toLowerCase() as string,
    created_by: user.id as number,
    course_id: course?.id,
    slug: chapterData.name.toLowerCase() as string
  };

  const fields = ['id', 'name', 'chapter_no', 'course_id', 'slug', 'created_by', 'created_at'];

  const data = await chapterHandler.insertOne(payload, fields);

  return data.rows[0] as Chapter;
}

export async function addChaptersController(chapterData: Chapter[], user: TokenUser): Promise<Chapter[]> {

  for (const chapter of chapterData) {
    let course;
    if (chapter.course_name) {
      course = await courseHandler.findOneByField({ name: chapter.course_name.toLowerCase() },
        ['id']);
    }

    chapter.name = chapter.name.toLowerCase();
    chapter.created_by = user.id;
    chapter.slug = chapter.name.toLowerCase();
    chapter.course_id = course?.id;
    delete chapter.course_name;
  }

  const payload: Chapter[] = chapterData;

  const fields = ['id', 'name', 'chapter_no', 'course_id', 'slug', 'created_by', 'created_at'];
  const uniqueField = 'id';

  const data = await chapterHandler.insertMany(payload, fields, uniqueField);

  return data.rows[0];
}

export async function getChapterController(chapterName: string): Promise<Chapter> {
  try {
    return await chapterHandler.dbHandler<{ chapterName: string }, Chapter>('GET_CHAPTER', {
      chapterName
    });
  } catch (error) {
    throw error;
  }
}

export async function updateChapterController(chapterData:UpdateChapter, chapterId:number, user: TokenUser)
:Promise<Chapter | boolean> {
  try {
    if (!chapterId) {
      return false;
    }
    const payload : UpdateChapter = {
      ...chapterData,
      updated_at: new Date().toISOString(),
      updated_by: user.id as number
    };

    const fields = ['id', 'name', 'course_id', 'chapter_no', 'updated_by', 'updated_at'];

    const data = await chapterHandler.updateOneById(chapterId, payload, fields);
    return data.rows[0] as Chapter;

  } catch (error) {
    throw error;
  }
}

export async function deleteChapterController(chapterId: number) : Promise<boolean> {
  try {
    if (!chapterId) {
      return false;
    }

    await chapterHandler.deleteOneById(chapterId);
    return true;
  } catch (error) {
    throw error;
  }
}
