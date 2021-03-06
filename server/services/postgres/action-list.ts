import { Actions } from 'interfaces/service-actions.type';

import {
  signInUser, resetPasswordService, updatePassword
} from './auth.service';
import {
  getUser, getUsers, verifyUserEmail
} from './users.service';
import {
  getPosts, getSinglePost, getPostsBytag,
  getPostsByUserId, getPostsCount, updateAndPublishPost
} from './posts.service';
import * as commonService from './query-builder.service';
import { getTags } from './tags.service';
import { addCoursesWithChapters, getCourse } from './course.service';
import { getChapter } from './chapter.service';
import {
  deleteUserChapter, getUserChapter,
  getUserChapterProgress, updateUserChapter
}
  from './user-chapter.service';
import {
  deleteUserCourse, getUserCourse, updateUserCourse
} from 'services/postgres/user-course.service';
import {
  getEventBySlug, getEvents, getEventsByUserId
} from './events.service';
import {
  deletePostTag, deletePostTagsByPostId, getPostsByTagId, getTagsByPostId
} from './post-tag.service';
import {
  deleteUserTag, deleteUserTags, getUserTagsByUserId, updateUserTag
} from './user-tag.service';
import { checkAdmin } from './admin.service';
import { deleteSubscriber, getSubscribers } from './subscribers.service';
import {
  addPostVote, deletePostVote, getPostVoteByUser, getPostVotes
} from './post-vote.service';
import {
  getFollower, getFollowers, unfollowUser
} from './followers.service';
import { getYearlyUserActivities, getUserActivityPoints } from './activities.service';
import {
  deleteEventAttendee, getEventAttendee, getEventAttendees
} from './event-register.service';


export const serviceActions: { [x in Actions]: any } = {
  GET_USER: getUser,
  SIGN_IN_USER: signInUser,
  GET_USERS: getUsers,
  VERIFY_USER_EMAIL: verifyUserEmail,

  CHECK_ADMIN: checkAdmin,

  GET_USER_TAGS_BY_USER_ID: getUserTagsByUserId,
  UPDATE_USER_TAG: updateUserTag,
  DELETE_USER_TAG: deleteUserTag,
  DELETE_USER_TAGS: deleteUserTags,

  GET_POST: getSinglePost,
  GET_POSTS: getPosts,
  GET_POSTS_BY_TAG: getPostsBytag,
  GET_POSTS_BY_USER_ID: getPostsByUserId,
  GET_POSTS_COUNT: getPostsCount,
  UPDATE_AND_PUBLISH_POST: updateAndPublishPost,

  GET_TAGS: getTags,

  GET_POSTS_BY_TAG_ID: getPostsByTagId,
  GET_TAGS_BY_POST_ID: getTagsByPostId,
  DELETE_POST_TAG: deletePostTag,
  DELETE_POST_TAGS_BY_POST_ID: deletePostTagsByPostId,

  ADD_POST_VOTE: addPostVote,
  GET_POST_VOTES: getPostVotes,
  GET_POST_VOTE_BY_USER: getPostVoteByUser,
  DELETE_POST_VOTE: deletePostVote,

  GET_COURSE: getCourse,
  ADD_COURSE_CHAPTERS: addCoursesWithChapters,

  GET_CHAPTER: getChapter,

  GET_USER_COURSE: getUserCourse,
  UPDATE_USER_COURSE: updateUserCourse,
  DELETE_USER_COURSE: deleteUserCourse,

  GET_USER_CHAPTER: getUserChapter,
  GET_USER_CHAPTER_PROGRESS: getUserChapterProgress,
  UPDATE_USER_CHAPTER: updateUserChapter,
  DELETE_USER_CHAPTER: deleteUserChapter,

  RESET_PASSWORD: resetPasswordService,
  UPDATE_PASSWORD: updatePassword,

  GET_EVENT_BY_SLUG: getEventBySlug,
  GET_EVENTS: getEvents,
  GET_EVENTS_BY_USER_ID: getEventsByUserId,

  GET_SUBSCRIBERS: getSubscribers,
  DELETE_SUBSCRIBER: deleteSubscriber,

  GET_FOLLOWER: getFollower,
  GET_FOLLOWERS: getFollowers,
  UNFOLLOW_USER: unfollowUser,

  GET_YEARLY_USER_ACTIVITIES: getYearlyUserActivities,
  GET_USER_ACTIVITY_POINTS: getUserActivityPoints,

  GET_EVENT_ATTENDEE: getEventAttendee,
  GET_EVENT_ATTENDEES: getEventAttendees,
  DELETE_EVENT_ATTENDEE: deleteEventAttendee
};

export const commonActions = {
  INSERT_ONE: commonService.insertOne,
  FIND_BY_ID: commonService.findOneById,
  INSERT_MANY: commonService.insertMany,
  DELETE_BY_ID: commonService.deleteOneById,
  UPDATE_BY_ID: commonService.updateOneById,
  UPDATE_BY_SINGLE_FIELD: commonService.updateBySingleField,
  FIND_ONE_BY_FIELD: commonService.findOneByField,
  FIND_MANY: commonService.findMany
};
