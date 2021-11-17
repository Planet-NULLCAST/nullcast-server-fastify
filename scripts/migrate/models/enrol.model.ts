import mongoose from 'mongoose';

const Enrol = mongoose.model(
  'Enrol',
  new mongoose.Schema<any>({
    UserId: String,
    CourseId: String,
    ChapterId: String
  })
);

export default Enrol;
