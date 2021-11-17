import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  chapterId: Number,
  chapterUrl: String,
  chapterName: String
});

const Course = mongoose.model<any>(
  'Course',
  new mongoose.Schema({
    courseId: Number,
    courseName: String,
    chapters: [chapterSchema]
  })
);

export default Course;
