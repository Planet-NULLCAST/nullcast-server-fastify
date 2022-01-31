import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Post = mongoose.model(
  'Post',
  new mongoose.Schema<any>(
    {
      userId: String,
      createdAt: String,
      updatedAt: String,
      publishedAt: String,
      url: {
        type: String,
        default: ''
      },
      createdBy: String,
      updatedBy: String,
      html: String,
      title: String,
      shortDescription: {
        type: String,
        default: ''
      },
      votes: [
        {
          userId: String,
          type: {
            type: String,
            required: true,
            enum: {
              values: ['up', 'down'],
              message: 'Must be either upvote or downvote'
            }
          },
          votedAt: {
            type: Date,
            default: Date.now()
          }
        }
      ],
      mobiledoc: {
        version: String,
        atoms: Array,
        markups: Array,
        cards: Array,
        sections: Array,
        ghostVersion: String
      }, //schema
      status: {
        type: String,
        default: 'drafted',
        enum: {
          values: ['drafted', 'pending', 'rejected', 'published'],
          message: 'Must be either drafted, pending, rejected or published'
        }
      },
      featured: {
        type: Boolean,
        default: false
      },
      canonicalUrl: {
        type: String,
        default: ''
      },
      tags: [String],
      primaryTag: String,
      primaryAuthor: {
        type: Schema.Types.ObjectId,
        ref: 'User' //schema
      },
      contributors: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User' // []schema
        }
      ],
      bannerImage: {
        type: String,
        default: ''
      },
      metaTitle: {
        type: String,
        default: ''
      },
      metaDescription: {
        type: String,
        default: ''
      },
      slug: {
        type: String,
        default: ''
      },
      type: String,
      previewUrl: String
    },
    {
      timestamps: { currentTime: () => new Date().toISOString() as unknown as number }
    }
  )
);

export default Post;
