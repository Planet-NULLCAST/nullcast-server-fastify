import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Skill = mongoose.model(
  'Skill',
  new mongoose.Schema<any>({
    name: {
      type: String,
      lowercase: true,
      trim: true
      // unique: true
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  })
);

export default Skill;
