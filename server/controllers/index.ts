import {
  createUserController, deleteUserController, getUserController, updateUserController, validateUserController
} from './users/users.controller';
import {
  createPostController, updatePostController, deletePostController
} from './posts/posts.controller';
import {
  createTagController, getTagController, updateTagController
} from './tags/tags.controller';

import { generateNewTokenController} from './tokens/tokens.controller';

export default {
  // users
  createUserController,
  getUserController,
  deleteUserController,
  updateUserController,
  validateUserController,

  // posts
  createPostController,
  // getPostController
  updatePostController,
  deletePostController,

  // tags
  createTagController,
  getTagController,
  updateTagController,

  //tokens
  generateNewTokenController
};
