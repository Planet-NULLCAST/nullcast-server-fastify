export type Actions =
  | 'CREATE_USER'
  | 'GET_USER'
  | 'DELETE_USER'
  | 'UPDATE_USER'
  | 'VALIDATE_USER'
  | 'GET_POSTS'
  | 'GET_POST'
  | 'GET_POSTS_BY_TAG'
  | 'GET_TAGS';

export type CommonActions =
  | 'INSERT_ONE'
  | 'INSERT_MANY'
  | 'FIND_BY_ID'
  | 'DELETE_BY_ID'
  | 'UPDATE_BY_ID';
