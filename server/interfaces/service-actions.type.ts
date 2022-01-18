export type Actions =
  | 'GET_USER'
  | 'SIGN_IN_USER'
  | 'GET_USERS'
  | 'VERIFY_USER_EMAIL'

  | 'CHECK_ADMIN'

  | 'GET_USER_TAGS_BY_USER_ID'
  | 'UPDATE_USER_TAG'
  | 'DELETE_USER_TAG'
  | 'DELETE_USER_TAGS'

  | 'GET_POST'
  | 'GET_POSTS'
  | 'GET_POSTS_BY_TAG'
  | 'GET_POSTS_BY_USER_ID'
  | 'GET_POSTS_COUNT'

  | 'GET_TAGS'

  | 'GET_POSTS_BY_TAG_ID'
  | 'GET_TAGS_BY_POST_ID'
  | 'DELETE_POST_TAG'
  | 'DELETE_POST_TAGS_BY_POST_ID'

  | 'ADD_POST_VOTE'
  | 'GET_POST_VOTES'
  | 'GET_POST_VOTE_BY_USER'
  | 'DELETE_POST_VOTE'

  | 'GET_COURSE'
  | 'ADD_COURSE_CHAPTERS'

  | 'GET_CHAPTER'

  | 'GET_USER_COURSE'
  | 'UPDATE_USER_COURSE'
  | 'DELETE_USER_COURSE'

  | 'GET_USER_CHAPTER'
  | 'GET_USER_CHAPTER_PROGRESS'
  | 'UPDATE_USER_CHAPTER'
  | 'DELETE_USER_CHAPTER'
  | 'RESET_PASSWORD'
  | 'UPDATE_PASSWORD'

  | 'GET_EVENT_BY_SLUG'
  | 'GET_EVENTS'
  | 'GET_EVENTS_BY_USER_ID'

  | 'GET_SUBSCRIBERS'

  | 'GET_FOLLOWER'
  | 'GET_FOLLOWERS'
  | 'UNFOLLOW_USER'

  | 'GET_USER_ACTIVITIES'

  | 'GET_EVENT_ATTENDEES'
  | 'DELETE_EVENT_ATTENDEE';

export type CommonActions =
  | 'INSERT_ONE'
  | 'INSERT_MANY'
  | 'FIND_BY_ID'
  | 'DELETE_BY_ID'
  | 'UPDATE_BY_ID';
