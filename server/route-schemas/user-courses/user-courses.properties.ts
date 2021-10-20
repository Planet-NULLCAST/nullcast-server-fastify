export default function userCourseProps() {
  return {
    user_id: {
      type: 'number',
      description: 'Id of the User'
    },
    course_id: {
      type: 'number',
      description: 'Id of the Course'
    }
  };
}
