export function chapterProps(field = 'course_id') {
  const data: any = {
    name: {
      type: 'string',
      description: 'Name of the Chapter'
    },
    chapter_no: {
      type: 'number',
      description: 'Serial number of the Chapter'
    }
  };

  if (field == 'course_name') {
    data.course_name = {
      type: 'string',
      description: 'Name of the Course'
    }
  } else {
    data.course_id = {
      type: 'number',
      description: 'Id of the Course'
    }
  };
  return (
    data
  );
}
