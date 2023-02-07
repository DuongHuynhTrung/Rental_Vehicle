const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
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
      maxLength: 255,
      required: [true, "Please add your gender."],
    },
    dob: {
      type: String,
      maxLength: 255,
      required: [true, "Please add your birthday."],
    },
    address: {
      type: String,
      maxLength: 255,
      required: [true, "Please add your address."],
    },
    phone: {
      type: Number,
      maxLength: 10,
      required: [true, "Please add your phone."],
      unique: [true, "This phone number has already taken"],
    },
    email: {
      type: String,
      maxLength: 255,
      required: [true, "Please add your email."],
      unique: [true, "Email address has already taken."],
    },
    password: {
      type: String,
      maxLength: 255,
      required: [true, "Please add your password."],
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      // required: [true],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
