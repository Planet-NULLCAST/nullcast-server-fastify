import { Post, UpdatePost, DeletePost } from "interfaces/post.type";
import { DatabaseHandler } from "services/postgres/postgres.handler";
import { POST_TABLE } from "constants/tables";

const postHandler = new DatabaseHandler(POST_TABLE);


export async function createPostController(postData:Post): Promise<boolean> {
    try {
        const payload : Post = {
            primary_tag: postData.primary_tag,
            slug: postData.slug,
            created_by: postData.created_by,
            published_by: postData.published_by
        }
          await postHandler.insertOne(payload)
          return true;

    } catch(error) {
        throw error;
    }
}

export async function updatePostController(postData:UpdatePost) :Promise<boolean> {
    try {
        const id = postData.id as number;
        if (!postData.id) {
            return false;
        }

        const payload : UpdatePost = {
            slug: postData.slug,
        }
          await postHandler.updateOneById(id, payload)
          return true;

    } catch(error) {
        throw error;
    }
}

export async function deletePostController(postData:DeletePost) : Promise<boolean> {
    try {
        const id = postData.id as number;

        if(!id) {
            return false;
        }
        
        await postHandler.deleteOneById(id);
        return true;
    } catch(error) {
        throw error;
    }
}