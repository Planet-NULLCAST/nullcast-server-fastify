import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: ''
  },
  username: String,
  email: String,
  password: String,
  roles: String,
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  skills: [String],
  createdAt: String,
  updatedAt: String,
  slug: String,
  coverImage: String,
  status: String,
  lastActive: String,
  dob: String,
  primaryBadge: String,
  blogCount: Number,
  followersId: [String],
  metaDescription: String,
  metaTitle: String,
  twitter: {
    type: String,
    default: ''
  },
  facebook: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  discord: String,
  lastSeen: String
});
const User = mongoose.model('User', userSchema);

export default User;
module.exports.userSchema = userSchema;
