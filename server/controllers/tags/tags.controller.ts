import { TAGS_STATUS } from 'constants/constants';
import { TAGS_TABLE, USER_TABLE } from 'constants/tables';
import { QueryParams } from 'interfaces/query-params.type';
import { Tag } from 'interfaces/tags.type';
import { DatabaseHandler } from 'services/postgres/postgres.handler';


const tagsHandler = new DatabaseHandler(TAGS_TABLE);
const usershandler = new DatabaseHandler(USER_TABLE);

export async function createTagController(payload: Tag) {
  try {
    // checking if the given id exists
    const user = await usershandler.findOneById(payload.created_by, ['id']);

    if (!user) {
      throw { statusCode: 404, message: 'provided user_id not found' };
    }

    const tagData: Tag = {
      ...payload,
      name: payload.name.trim().toLowerCase(),
      slug: payload.name.trim().replace(' ', '_').toLowerCase(),
      // TODO: Add visibility
      // visibility: TAGS_VISIBILITY.includes(payload.visibility) ? payload.visibility : 'public',
      status: TAGS_STATUS.includes(payload.status) ? payload.status : 'active'
    };
    await tagsHandler.insertOne<Tag, Tag>(tagData);
    return true;
  } catch (error) {
    if (error.code) {
      switch (error.code) {
        case '23505':
          throw { statsCode: 400, message: error.message };
      }
    }
    throw error;
  }
}

export async function getTagController(tagName: string) {
  try {
    const data = { name: tagName };
    // TODO: Add visibility
    const tagData = await tagsHandler.findOneByField(data, ['id', 'name', 'description', 'meta_title', 'meta_description', 'feature_image', 'slug', 'status', 'created_at', 'updated_at', 'created_by']);
    if (tagData) {
      return tagData;
    }
    throw { statusCode: 404, message: 'tag not found' };
  } catch (error) {
    throw error;
  }
}

export async function updateTagController(tagName: string, payload: Tag) {
  try {
    const data = { name: tagName };
    const tagData = await tagsHandler.findOneByField(data, ['id']);

    if (tagData) {
      const updatedData = await tagsHandler.updateOneById(tagData.id, payload);
      if (updatedData) {
        return true;
      }
    }
    throw { statusCode: 404, message: 'tag update failed' };

  } catch (error) {
    throw error;
  }
}

export async function getTagsController(qParam:QueryParams) {
  try {
    const tags: Tag[] = await tagsHandler.dbHandler('GET_TAGS', qParam);
    return tags;
  } catch (error) {
    throw error;
  }
}

export async function deleteTagController(tagId: number) {
  try {
    await tagsHandler.deleteOneById(tagId);
    return true;
  } catch (error) {
    throw error;
  }
}
