const asyncHandler = require("express-async-handler");
const User = require("../modules/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminMail = "admin@gmail.com";

//@desc Get all users
//@route GET /api/users
//@access private
const getUsers = asyncHandler(async (req, res, next) => {
  if (req.user.email !== adminMail) {
    res.status(403);
    throw new Error("Only Admin have permission to see all User");
  }
  const users = await User.find();
  res.status(200).json(users);
});

//@desc Register New user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, gender, dob, address, phone, email, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !gender ||
    !dob ||
    !address ||
    !phone ||
    !email ||
    !password
  ) {
    res.status(400);
    throw new Error("All field not be empty!");
  }
  const userEmailAvailable = await User.findOne({ email });
  if (userEmailAvailable) {
    res.status(400);
    throw new Error("User has already registered with Email!");
  }

  const userPhoneAvailable = await User.findOne({ phone });
  if (userPhoneAvailable) {
    res.status(400);
    throw new Error("User has already registered with Phone Number!");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    gender,
    dob,
    address,
    phone,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error("User data is not Valid!");
  }
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All field not be empty!");
  }
  const user = await User.findOne({ email });
  //compare password to hashedPassword
  if (user && bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign(
      {
        user: {
          userName: user.lastName,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or Password is not Valid!");
  }
});

//@desc Current User Info
//@route GET /api/users/current
//@access private
const currentUserInfo = asyncHandler(async (req, res, next) => {
  res.json(req.user);
});

//@desc Get user
//@route GET /api/users/:id
//@access private
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User Not Found!");
  }
  const userEmail = user.email;
  if (!(req.user.email === userEmail || req.user.email === adminMail)) {
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
    throw new Error("User Not Found!");
  }
  const { firstName, lastName, gender, dob, address, phone, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !gender ||
    !dob ||
    !address ||
    !phone ||
    !password
  ) {
    res.status(400);
    throw new Error("All field not be empty!");
  }
  const userEmail = user.email;
  if (!(req.user.email === userEmail || req.user.email === adminMail)) {
    res.status(403);
    throw new Error("You don't have permission to update user's profile");
  }
  const userAvailable = await User.findOne({ phone });
  if (userAvailable) {
    res.status(400);
    throw new Error("This Phone has already Exist!");
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
    throw new Error("User Not Found!");
  }
  const userEmail = user.email;
  if (!(req.user.email === userEmail || req.user.email === adminMail)) {
    res.status(403);
    throw new Error("You don't have permission to update user's profile");
  }
  await User.deleteOne({ _id: req.params.id });
  res.status(200).json(user);
});

module.exports = {
  getUsers,
  registerUser,
  getUserById,
  updateUsers,
  deleteUsers,
  loginUser,
  currentUserInfo,
};
