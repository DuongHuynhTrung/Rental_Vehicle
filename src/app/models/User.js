const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    oauth_id: {
      type: String,
    },
    firstName: {
      type: String,
      maxLength: 255,
      required: [true, "Please add your first name."],
    },
    lastName: {
      type: String,
      maxLength: 255,
      required: [true, "Please add your last name."],
    },
    gender: {
      type: String,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
    },
    address_details: {
      type: String,
    },
    phone: {
      type: String,
      maxLength: 10,
    },
    email: {
      type: String,
      maxLength: 255,
      required: [true, "Please add your email."],
      unique: [true, "Email address has already taken."],
    },
    password: {
      type: String,
    },
    imgURL: {
      type: String,
    },
    booked: {
      type: Number,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: [true],
    },
    status: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: Number,
    },
    otpExpires: {
      type: Date,
    },
    rate: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
