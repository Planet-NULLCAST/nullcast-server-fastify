import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Tag = mongoose.model(
  'Tag',
  new mongoose.Schema<any>(
    {
      name: {
        type: String,
        lowercase: true,
        trim: true
      },
      count: { type: Number, default: 0 },
      user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        default: 'enabled',
        enum: {
          values: ['enabled', 'disabled'],
          message: 'Must be either enabled or disabled'
        }
      }
    },
    {
      timestamps: { currentTime: () => new Date().toISOString() as unknown as number }
    }
  )
);

export default Tag;
