import { RouteOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance";
import  controller  from "../../controllers/index";
import  { createUserSchema, getUserSchema, updateUserSchema, deleteUserSchema }  from "../../route-schemas/users/users.schema";
import { ValidateUser, User } from "interfaces/user.type";



// const getUsers: RouteOptions = {
//     method: 'GET',
//     url: '/users',
//     handler: async (_, reply) => {
//         reply.code(200).send({data:'Some data'});
//     }
// }

const getUser: RouteOptions = {
    method: 'GET',
    url: '/user/:user_name',
    schema: getUserSchema,
    handler: async (request, reply) => {
        const params = request.params as {user_name: string};
        const userData =  await controller.getUserController(params.user_name);
        reply.code(200).send({data: userData});
    }
}

const createUser: RouteOptions = {
    method: 'POST',
    url: '/user',
    schema: createUserSchema,
    handler: async (request, reply ) => {
        try {
            const userToken = await controller.createUserController(request.body as User );

            if(userToken) {
                reply.setCookie('token', userToken, {signed: false});
                reply.code(200).send({message: 'User created'});
            } else {
                reply.code(500).send({message:'Something Error happend'});
            }

        } catch(error) {
            throw error;
        }
        
    }
}

const updateUser: RouteOptions = {
    method: 'PUT',
    url: '/user',
    schema: updateUserSchema,
    handler: async (request, reply ) => {
        try {
            if (await controller.updateUserController(request.body as User)) {
                reply.code(200).send({message: 'User updated'});
            } else {
                reply.code(500).send({message:'Something Error happend'});
            }
        } catch(error) {
            throw error;
        }
    }
}

const deleteUser: RouteOptions = {
    method: 'DELETE',
    url: '/user',
    schema: deleteUserSchema,
    handler: async (request, reply) => {
        const requesyBody = request.body as ValidateUser;

        if(await controller.deleteUserController(requesyBody)) {
            reply.code(201).send({message: 'User deleted'});
        } else {
            reply.code(500).send({message: 'User not deleted'})
        }
    }
}

function initUsers(server:FastifyInstance) {
    // server.route(getUsers);
    server.route(getUser);
    server.route(createUser);
    server.route(deleteUser);
    server.route(updateUser);

}

export default initUsers;