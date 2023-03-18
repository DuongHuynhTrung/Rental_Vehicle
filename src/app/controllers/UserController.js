const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Role = require('../models/Role');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const moment = require('moment/moment');

//@desc Register New user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    gender,
    dob,
    address,
    phone,
    email,
    password,
    roleName,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !gender ||
    !dob ||
    !address ||
    !phone ||
    !email ||
    !password ||
    !roleName
  ) {
    res.status(400);
    throw new Error('All field not be empty!');
  }
  const userEmailAvailable = await User.findOne({ email });
  if (userEmailAvailable) {
    res.status(400);
    throw new Error('User has already registered with Email!');
  }

  const userPhoneAvailable = await User.findOne({ phone });
  if (userPhoneAvailable) {
    res.status(400);
    throw new Error('User has already registered with Phone Number!');
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = await Role.findOne({ roleName });
  const user = await User.create({
    firstName,
    lastName,
    gender,
    dob,
    address,
    phone,
    email,
    password: hashedPassword,
    role_id: role._id.toString(),
  });
  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error('User data is not Valid!');
  }
});

//@desc Get all users
//@route GET /api/users
//@access private
const getUsers = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.user.role_id);
  if (role.roleName !== 'Admin') {
    res.status(403);
    throw new Error('Only Admin have permission to see all User');
  }
  const users = await User.find().populate('role_id').exec();
  if (users.length === 0) {
    res.status(404);
    throw new Error("Website don't have any member!");
  }
  res.status(200).json(users);
});

//@desc Get all users
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found!');
  }
  res.status(200).json(user);
});

//@desc Block User
//@route GET /api/users/blocked/:id
//@access private
const blockUsers = asyncHandler(async (req, res) => {
  const user_id = req.params.id;
  const user = await User.findById(user_id);
  if (!user) {
    res.status(404);
    throw new Error('User not found!');
  }
  if (req.user.roleName !== 'Admin') {
    res.status(403);
    throw new Error('Only admins can block users!');
  }
  const blockUsers = await User.findByIdAndUpdate(user_id, {
    status: false,
  });
  if (!blockUsers) {
    res.status(500);
    throw new Error('Something went wrong in blockUsers');
  }
  res.status(200).json({ message: 'Blocked successfully' });
});

//@desc Current User Info
//@route GET /api/users/current
//@access private
const searchUserByName = asyncHandler(async (req, res, next) => {
  const lastName = req.query.lastName;
  if (!lastName || lastName === undefined) {
    res.status(500);
    throw new Error('Something went wrong when pass query to searchUserByName');
  }
  User.find({ lastName: { $regex: lastName, $options: 'i' } }, (err, users) => {
    if (err) {
      // Handle error
      res.status(500);
      throw new Error(err.message);
    } else {
      // Send the results as a JSON response to the client
      res.json(users);
    }
  });
});

//@desc Get user
//@route GET /api/users/:id
//@access private
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User Not Found!');
  }
  const userEmail = user.email;
  if (!(req.user.email === userEmail || req.user.roleName === 'Admin')) {
    res.status(403);
    throw new Error("You don't have permission to get user's profile");
  }
  res.status(200).json(user);
});

//@desc Update user
//@route PUT /api/users/:id
//@access private
const updateUsers = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User Not Found!');
  }
  const { firstName, lastName, gender, dob, address, phone } = req.body;
  if (!firstName || !lastName || !gender || !dob || !address || !phone) {
    res.status(400);
    throw new Error('All field not be empty!');
  }
  if (req.user.email !== user.email) {
    res.status(403);
    throw new Error("You don't have permission to update user's profile");
  }
  const isChangePhone = user.phone.toString() !== phone ? true : false;
  if (isChangePhone) {
    const userAvailable = await User.findOne({ phone });
    if (userAvailable) {
      res.status(400);
      throw new Error('This Phone has already Exist!');
    }
  }
  const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updateUser);
});

//@desc Delete user
//@route DELETE /api/users/:id
//@access private
const deleteUsers = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User Not Found!');
  }
  if (req.user.roleName !== 'Admin') {
    res.status(403);
    throw new Error("You don't have permission to update user's profile");
  }
  await User.deleteOne({ _id: req.params.id });
  res.status(200).json(user);
});

//@desc update Role of user to Hotelier
//@route GET /api/users/upRole/:id
//@access private
const updateRoleToHotelier = asyncHandler(async (req, res, next) => {
  const user_id = req.params.id;
  const user = await User.findById(user_id);
  if (!user) {
    res.status(404);
    throw new Error('User not Found!');
  }
  if (req.user.roleName !== 'Admin') {
    res.status(403);
    throw new Error('Only Admin can update role of User to Hotelier');
  }
  const updateRole = await User.findByIdAndUpdate(
    user_id,
    {
      role_id: '63e4736f62bf96d8df480f5a',
    },
    { new: true }
  );
  if (!updateRole) {
    res.status(500);
    throw new Error('Something when wrong in update Role User to Hotelier!');
  }
  res.status(200).json(updateRole);
});

//@desc User change password
//@route GET /api/users/checkOldPassword/:id
//@access private
const checkOldPassword = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { password } = req.body;
  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    res.status(401);
    throw new Error('Old password is incorrect');
  }
  res.status(200).json(user);
});

//@desc User change password
//@route GET /api/users/changePassword/:id
//@access private
const changePassword = asyncHandler(async (req, res, next) => {
  const user_id = req.params.id;
  const user = await User.findById(user_id);
  if (!user) {
    res.status(404);
    throw new Error('User not Found!');
  }
  if (req.user.id !== user_id) {
    res.status(403);
    throw new Error("You don't have permission to change other password!");
  }
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    res.status(400);
    throw new Error('All field not be empty!');
  }
  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Password and confirm password are different!');
  }
  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  if (!hashedPassword) {
    res.status(500);
    throw new Error(
      'Something when wrong in hashPassword of changePassword function!'
    );
  }
  const updatePassword = await User.findByIdAndUpdate(
    user_id,
    {
      password: hashedPassword,
    },
    { new: true }
  );
  if (!updatePassword) {
    res.status(500);
    throw new Error('Something when wrong in changePassword');
  }
  res.status(200).json(updatePassword);
});

//@desc User update profile image
//@route GET /api/users/profile
//@access private
const updateAvatarUser = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const imgURL = req.file.filename;
  const updateProfile = await User.findByIdAndUpdate(
    user_id,
    {
      imgURL,
    },
    {
      new: true,
    }
  );
  if (!updateProfile) {
    res.status(500);
    throw new Error('Something wrong when wrong in updateProfile');
  }
  res.status(200).json(updateProfile);
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpires = new Date();
    await user.save();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset Password OTP',
      text: `Your OTP to reset your password is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    res.status(200).json('OTP sent to email');
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error(
      'Something went wrong when sending email to reset password'
    );
  }
};

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    if (user.otp.toString() !== otp) {
      res.status(400);
      throw new Error('Wrong OTP! Please try again');
    }
    const currentTime = moment(new Date());
    const otpExpires = moment(user.otpExpires);
    const isExpired = currentTime.diff(otpExpires, 'minutes');
    if (isExpired > 10) {
      res.status(400);
      throw new Error('OTP is expired! Please try again');
    }
    const newPassword = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(newPassword.toString(), 10);
    const updateUser = await User.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    if (!updateUser) {
      res.status(500);
      throw new Error(
        'Something went wrong when updating new password in reset password!'
      );
    }
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset Password Successfully',
      text: `This is your new password: ${newPassword}. Please login to continue!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    res.status(200).json('Reset password successfully');
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

module.exports = {
  registerUser,
  getUsers,
  getUserById,
  updateUsers,
  deleteUsers,
  searchUserByName,
  currentUser,
  blockUsers,
  updateRoleToHotelier,
  checkOldPassword,
  changePassword,
  updateAvatarUser,
  forgotPassword,
  resetPassword,
};
