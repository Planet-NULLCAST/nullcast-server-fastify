import  controller  from "../controllers/index";
import ajv from '../validator/validator';
import { User, UserType } from '../route-schemas/users/user.schema';
import { RouteOptions } from "fastify";


const createUser: RouteOptions = {
    method: 'POST',
    url: '/user',
    handler: async (request, reply) => {
        try {
            const { body: userData } = request;
            const isValid = ajv.validate(User, userData);
            if (isValid) {
                // const userStatus = await controller.createUserController(userData as UserType);

                // if(userStatus) {
                //     reply.code(201).send({message: 'User created'});
                // } else {
                //     reply.code(500).send({message:'Something Error happend'});
                // }

            } else {
                console.log('Body Validation Error', reply);
            }
        } catch (error) {
            console.log('-- Error --', error);
        }
    } 
}