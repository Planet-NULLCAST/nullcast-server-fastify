import {createUserController, deleteUserController, getUserController, updateUserController, validateUserController} from './users/users.controller'
import {createPostController, updatePostController, deletePostController} from './posts/posts.controller'

export default {
    createUserController,
    getUserController,
    deleteUserController,
    updateUserController,
    validateUserController,

    createPostController,
    // getPostController
    updatePostController,
    deletePostController,
}