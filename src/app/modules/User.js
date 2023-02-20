const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    oauth_id: {
      type: String,
    },
    firstName: {
      type: String,
      maxLength: 255,
      required: [true, 'Please add your first name.'],
    },
    lastName: {
      type: String,
      maxLength: 255,
      required: [true, 'Please add your last name.'],
    },
    gender: {
      type: String,
    },
    dob: {
      type: String,
    },
    address: {
      type: String,
      maxLength: 255,
    },
    phone: {
      type: Number,
      maxLength: 10,
      unique: [true, 'This phone number has already taken'],
    },
    email: {
      type: String,
      maxLength: 255,
      required: [true, 'Please add your email.'],
      unique: [true, 'Email address has already taken.'],
    },
    password: {
      type: String,
      maxLength: 255,
    },
    imgURL: {
      type: String,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: [true],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
