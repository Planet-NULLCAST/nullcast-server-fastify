import { RouteOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance";
import  controller  from "../../controllers/index";
import { Post, DeletePost } from "interfaces/post.type";


const createPost: RouteOptions = {
    method: 'POST',
    url: '/api/post',
    handler: async (request, reply ) => {
        try {
            const post = await controller.createPostController(request.body as Post );

            if(post) {
                reply.code(200).send({message: 'Post created'});
            } else {
                reply.code(500).send({message:'Something Error happend'});
            }

        } catch(error) {
            throw error;
        }
        
    }
}

// const getPost: RouteOptions = {
//     method: 'GET',
//     url: '/api/post/:postName',
//     handler: async (request, reply) => {
//         const params = request.params as {postName: string};
//         const postData =  await controller.getPostController(params.postName);
//         reply.code(200).send({data: postData});
//     }
// }

const updatePost: RouteOptions = {
    method: 'PUT',
    url: '/api/post',
    handler: async (request, reply ) => {
        try {
            if (await controller.updatePostController(request.body as Post)) {
                reply.code(200).send({message: 'Post updated'});
            } else {
                reply.code(500).send({message:'Something Error happend'});
            }
        } catch(error) {
            throw error;
        }
    }
}

const deletePost: RouteOptions = {
    method: 'DELETE',
    url: '/api/post',
    handler: async (request, reply) => {
        const requestBody = request.body as DeletePost;

        if(await controller.deletePostController(requestBody)) {
            reply.code(201).send({message: 'Post deleted'});
        } else {
            reply.code(500).send({message: 'Post not deleted'})
        }
    }
}


function initPosts(server:FastifyInstance) {
    server.route(createPost);
    // server.route(getPost);
    server.route(updatePost);
    server.route(deletePost);
    
}

export default initPosts;