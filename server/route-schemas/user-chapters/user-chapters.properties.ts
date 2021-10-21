export default function userChapterProps() {
  return {
    user_id: {
      type: 'number',
      description: 'Id of the User'
    },
    course_id: {
      type: 'number',
      description: 'Id of the Course'
    },
    chapter_id: {
      type: 'number',
      description: 'Id of the Chapter'
    }
  };
}
