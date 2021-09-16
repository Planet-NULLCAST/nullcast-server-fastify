import { TAGS_STATUS, TAGS_VISIBILITY } from 'constants/constants';
import { TAGS_TABLE } from 'constants/tables';
import { UserData } from 'interfaces/auth-token.type';
import { QueryParams } from 'interfaces/query-params.type';
import { Tag } from 'interfaces/tags.type';
import { DatabaseHandler } from 'services/postgres/postgres.handler';


const tagsHandler = new DatabaseHandler(TAGS_TABLE);


export async function createTagController(payload: Tag, userData: UserData) {
  try {

    const tagData: Tag = {
      ...payload,
      name: payload.name.trim().toLowerCase(),
      slug: payload.name.trim().replace(' ', '_').toLowerCase(),
      visibility: TAGS_VISIBILITY.includes(payload.visibility) ? payload.visibility : 'public',
      status: TAGS_STATUS.includes(payload.status) ? payload.status : 'active',
      created_by: userData.id
    };
    const tag = await tagsHandler.insertOne<Tag, Tag>(tagData, ['name', 'description', 'meta_title', 'meta_description', 'feature_image', 'slug', 'status', 'created_at', 'updated_at', 'created_by', 'visibility']);
    return tag.rows[0];
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
    const tagData = await tagsHandler.findOneByField(data, ['id', 'name', 'description', 'meta_title', 'meta_description', 'feature_image', 'slug', 'status', 'created_at', 'updated_at', 'created_by', 'visibility', 'updated_by']);
    if (tagData) {
      return tagData;
    }
    throw { statusCode: 404, message: 'tag not found' };
  } catch (error) {
    throw error;
  }
}

export async function updateTagController(tagName: string, payload: Tag, userData: UserData) {
  try {
    const data = { name: tagName };
    const tagData = await tagsHandler.findOneByField(data, ['id', 'created_by']);

    if (tagData) {
      const updatedTagData = {
        ...payload,
        updated_by: userData.id,
        created_by: tagData.created_by,
        updated_at: new Date().toISOString()
      };
      const updatedData = await tagsHandler.updateOneById(tagData.id, updatedTagData, ['id', 'name', 'description', 'meta_title', 'meta_description', 'feature_image', 'slug', 'status', 'created_at', 'updated_at', 'created_by', 'visibility', 'updated_by']);
      if (updatedData) {
        return updatedData.rows[0];
      }
    }
    throw { statusCode: 404, message: 'tag update failed' };

  } catch (error) {
    throw error;
  }
}

export async function getTagsController(qParam: QueryParams) {
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
