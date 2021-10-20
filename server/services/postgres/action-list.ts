import { Actions } from 'interfaces/service-actions.type';
import { signInUser } from './auth.service';
import { getUser, getUsers } from './users.service';
import {
  getPosts, getSinglePost, getPostsBytag, getPostsByUserId
} from './posts.service';
import * as commonService from './query-builder.service';
import { getTags } from './tags.service';
import { addCoursesWithChapters, getCourse } from './course.service';
import { getChapter } from './chapter.service';
import { get_user_chapter_progress } from './user-chapter.service';

export const serviceActions: { [x in Actions]: any } = {
  GET_USER: getUser,
  SIGN_IN_USER: signInUser,
  GET_USERS: getUsers,

  GET_POSTS: getPosts,
  GET_POST: getSinglePost,
  GET_POSTS_BY_TAG: getPostsBytag,
  GET_POSTS_BY_USER_ID: getPostsByUserId,
  GET_TAGS: getTags,

  GET_COURSE: getCourse,
  ADD_COURSE_CHAPTERS: addCoursesWithChapters,

  GET_CHAPTER: getChapter,

  GET_USER_CHAPTER_PROGRESS: get_user_chapter_progress
};

export const commonActions = {
  INSERT_ONE: commonService.insertOne,
  FIND_BY_ID: commonService.findOneById,
  INSERT_MANY: commonService.insertMany,
  DELETE_BY_ID: commonService.deleteOneById,
  UPDATE_BY_ID: commonService.updateOneById,
  FIND_ONE_BY_FIELD: commonService.findOneByField
};
