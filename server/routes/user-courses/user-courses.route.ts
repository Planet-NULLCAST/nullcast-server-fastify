import {RouteOptions} from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';

import * as controller from '../../controllers/index';
import { TokenUser } from 'interfaces/user.type';
import { UpdateUserCourse, UserCourse } from 'interfaces/user-course.type';
import {
  deleteUserCourseSchema, enrolUserCourseSchema, getUserCourseSchema, 
  updateUserCourseSchema
} from 'route-schemas/user-courses/user-courses.schema';


const enrolUserCourse: RouteOptions = {
  method: 'POST',
  url: '/user-course',
  schema: enrolUserCourseSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const userCourseData = await controller.enrolCourseController(request.body as UserCourse, user);
      if (userCourseData) {
        reply.code(201).send({message: 'User enrolled to course', data: userCourseData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }

  }
};

const getUserCourse: RouteOptions = {
  method: 'GET',
  url: '/user-course/:user_course_id',
  schema: getUserCourseSchema,
  handler: async(request, reply) => {
    const params = request.params as {user_course_id: number};
    const userCourseData =  await controller.getUserCourseController(params.user_course_id);
    if (userCourseData) {
      reply.code(200).send({message: 'User Course Found', data: userCourseData});
    }
    reply.code(400).send({message: 'USer Course not Found'});

  }
};

const updateUserCourse: RouteOptions = {
  method: 'PUT',
  url: '/user-course/:user_course_id',
  schema: updateUserCourseSchema,
  handler: async(request, reply) => {
    try {
      const params = request.params as {user_course_id: number};
      const user = request.user as TokenUser;
      const userCourseData = await controller.updateUserCourseController(
        request.body as UpdateUserCourse, params.user_course_id, user);
      if (userCourseData) {
        reply.code(200).send({message: 'User Course updated', data:userCourseData});
      } else {
        reply.code(500).send({message:'User Course not found'});
      }
    } catch (error) {
      throw error;
    }
  }
};

const deleteUserCourse: RouteOptions = {
  method: 'DELETE',
  url: '/user-course/:user_course_id',
  schema: deleteUserCourseSchema,
  handler: async(request, reply) => {
    const params = request.params as {user_course_id: number};

    if (await controller.deleteUserCourseController(params.user_course_id)) {
      reply.code(200).send({message: 'User Course deleted'});
    } else {
      reply.code(500).send({message: 'User Course not deleted'});
    }
  }
};


function initUserCourses(server:FastifyInstance, _:any, done: () => void) {
  server.route(enrolUserCourse);
  server.route(getUserCourse);
  server.route(updateUserCourse);
  server.route(deleteUserCourse);

  done();
}

export default initUserCourses;
