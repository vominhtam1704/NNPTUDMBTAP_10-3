const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: 'https://i.sstatic.net/l60Hf.png',
    },
    status: {
      type: Boolean,
      default: false,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
