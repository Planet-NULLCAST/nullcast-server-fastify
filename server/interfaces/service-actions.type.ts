export type Actions =
  | 'GET_USER'
  | 'SIGN_IN_USER'
  | 'GET_USERS'

  | 'GET_POSTS'
  | 'GET_POST'
  | 'GET_POSTS_BY_TAG'
  | 'GET_POSTS_BY_USER_ID'
  | 'GET_TAGS'

  | 'GET_COURSE'

  | 'GET_CHAPTER';

export type CommonActions =
  | 'INSERT_ONE'
  | 'INSERT_MANY'
  | 'FIND_BY_ID'
  | 'DELETE_BY_ID'
  | 'UPDATE_BY_ID';
