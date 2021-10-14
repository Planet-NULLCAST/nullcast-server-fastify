import {RouteOptions} from 'fastify';
import {FastifyInstance} from 'fastify/types/instance';

import {
  Course, CourseChapter, UpdateCourse
} from 'interfaces/course.type';
import * as controller from '../../controllers/index';
import { TokenUser } from 'interfaces/user.type';
import {
  createCourseSchema, addCoursesSchema, deleteCourseSchema,
  getCourseSchema, updateCourseSchema, addCoursesWithChaptersSchema
} from 'route-schemas/course/course.schema';


const createCourse: RouteOptions = {
  method: 'POST',
  url: '/course',
  schema: createCourseSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const courseData = await controller.createCourseController(request.body as Course, user);
      if (courseData) {
        reply.code(201).send({message: 'Course added', data: courseData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }

  }
};

const addCourses: RouteOptions = {
  method: 'POST',
  url: '/courses',
  schema: addCoursesSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const courseData = await controller.addCoursesController(request.body as Course[], user);
      if (courseData) {
        reply.code(201).send({message: 'Courses added', data: courseData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }

  }
};

const addCoursesWithChapters: RouteOptions = {
  method: 'POST',
  url: '/courses-chapters',
  schema: addCoursesWithChaptersSchema,
  handler: async(request, reply) => {
    try {
      const user = request.user as TokenUser;
      const courseData = await controller.addCoursesWithChaptersController(request.body as CourseChapter[], user);
      if (courseData) {
        reply.code(201).send({message: 'Courses and its chapters added', data: courseData});
      } else {
        reply.code(500).send({message:'Something Error happend'});
      }

    } catch (error) {
      throw error;
    }

  }
};

const getCourse: RouteOptions = {
  method: 'GET',
  url: '/course/:course_name',
  schema: getCourseSchema,
  handler: async(request, reply) => {
    const params = request.params as {course_name: string};
    const courseData =  await controller.getCourseController(params.course_name.toLowerCase());
    if (courseData) {
      reply.code(200).send({message: 'Course Found', data: courseData});
    }
    reply.code(400).send({message: 'Course not Found'});

  }
};

const updateCourse: RouteOptions = {
  method: 'PUT',
  url: '/course/:courseId',
  schema: updateCourseSchema,
  handler: async(request, reply) => {
    try {
      const params = request.params as {courseId: number};
      const user = request.user as TokenUser;
      const course = await controller.updateCourseController(request.body as UpdateCourse, params.courseId, user);
      if (course) {
        reply.code(200).send({message: 'Course updated', data:course});
      } else {
        reply.code(500).send({message:'Course not found'});
      }
    } catch (error) {
      throw error;
    }
  }
};

const deleteCourse: RouteOptions = {
  method: 'DELETE',
  url: '/course/:courseId',
  schema: deleteCourseSchema,
  handler: async(request, reply) => {
    const params = request.params as {courseId: number};

    if (await controller.deleteCourseController(params.courseId)) {
      reply.code(200).send({message: 'Course deleted'});
    } else {
      reply.code(500).send({message: 'Course not deleted'});
    }
  }
};


function initCourses(server:FastifyInstance, _:any, done: () => void) {
  server.route(createCourse);
  server.route(addCourses);
  server.route(addCoursesWithChapters);
  server.route(getCourse);
  server.route(updateCourse);
  server.route(deleteCourse);

  done();
}

export default initCourses;
