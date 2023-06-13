const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Role = require("../models/Role");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const twilio = require("twilio");
const moment = require("moment/moment");

//@desc Register New user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      dob,
      address,
      address_details,
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
      !address_details ||
      !phone ||
      !email ||
      !password ||
      !roleName
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

    const date = new Date(dob);

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = await Role.findOne({ roleName });
    const user = await User.create({
      firstName,
      lastName,
      gender,
      dob: date,
      address,
      address_details,
      phone,
      email,
      password: hashedPassword,
      role_id: role._id.toString(),
    });
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(400);
      throw new Error("User data is not Valid!");
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Register New user
//@route POST /api/users/otpRegister
//@access public
const sendOTPWhenRegister = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(404);
      throw new Error("Invalid email address");
    }
    const userEmailAvailable = await User.findOne({ email });
    if (userEmailAvailable) {
      res.status(400);
      throw new Error("User has already been registered");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date();

    req.session.otp = otp;
    req.session.otpExpires = otpExpires;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify OTP when registering",
      // text: `Your OTP to reset your password is: ${otp}`,
      html: `<body style="background-color:#ffffff;font-family:HelveticaNeue,Helvetica,Arial,sans-serif">
          <table
            align="center"
            role="presentation"
            cellSpacing="0"
            cellPadding="0"
            border="0"
            width="100%"
            style="max-width:37.5em;background-color:#ffffff;border:1px solid #eee;border-radius:5px;box-shadow:0 5px 10px rgba(20,50,70,.2);margin-top:20px;width:360px;margin:0 auto;padding:68px 0 130px"
          >
            <tr style="width:100%">
              <td>
                <img
                  alt="Plaid"
                  src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.15752-9/349327131_6368862009826485_8287991177646664794_n.png?_nc_cat=109&ccb=1-7&_nc_sid=ae9488&_nc_ohc=CFCOpGi4ZhYAX81sRTS&_nc_ht=scontent.fsgn19-1.fna&oh=03_AdTgMIlkh0evXvMFxRKsZfvMn2uZ81u3AmTt4qLoyLuPkw&oe=64A0D375"
                  width="150"
                  height="auto"
                  style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto"
                />
                <p style="font-size:11px;line-height:16px;margin:16px 8px 8px 8px;color:#0a85ea;font-weight:700;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;height:16px;letter-spacing:0;text-transform:uppercase;text-align:center">
                  Verify Your Email
                </p>
                <h1 style="color:#000;display:inline-block;font-family:HelveticaNeue-Medium,Helvetica,Arial,sans-serif;font-size:20px;font-weight:500;line-height:24px;margin-bottom:0;margin-top:0;text-align:center">
                  Enter the following code to finish create account
                </h1>
                <table
                  style="background:rgba(0,0,0,.05);border-radius:4px;margin:16px auto 14px;vertical-align:middle;width:280px"
                  align="center"
                  border="0"
                  cellPadding="0"
                  cellSpacing="0"
                  role="presentation"
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td>
                        <p style="font-size:32px;line-height:40px;margin:0 auto;color:#000;display:inline-block;font-family:HelveticaNeue-Bold;font-weight:700;letter-spacing:6px;padding-bottom:8px;padding-top:8px;width:100%;text-align:center">
                          ${otp}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p style="font-size:15px;line-height:23px;margin:0;color:#444;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;letter-spacing:0;padding:0 40px;text-align:center">
                  Not expecting this email?
                </p>
                <p style="font-size:15px;line-height:23px;margin:0;color:#444;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;letter-spacing:0;padding:0 40px;text-align:center">
                  Contact
                  <a
                    target="_blank"
                    style="color:#444;text-decoration:underline"
                    href="mailto:infor.driveconn@gmail.com.com"
                  >
                    infor.driveconn@gmail.com
                  </a>
                  if you did not request this code.
                </p>
              </td>
            </tr>
          </table>
        </body>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        res.status(200).json({ otp, otpExpires });
      }
    });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Register New user
//@route POST /api/users/verifyOtpRegister
//@access public
const verifyOTPWhenRegister = asyncHandler(async (req, res, next) => {
  try {
    const { otp, otpExpired, otpStored } = req.body;
    try {
      if (otpStored !== otp) {
        res.status(400);
        throw new Error("Wrong OTP! Please try again");
      }
      const currentTime = moment(new Date());
      const otpExpires = moment(otpExpired);
      const isExpired = currentTime.diff(otpExpires, "minutes");
      if (isExpired > 10) {
        res.status(400);
        throw new Error("OTP is expired! Please try again");
      }

      //Create new user
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
        throw new Error("All field not be empty!");
      }
      const userEmailAvailable = await User.findOne({ email });
      if (userEmailAvailable) {
        res.status(400).send("User has already registered with Email!");
      }

      const userPhoneAvailable = await User.findOne({ phone });
      if (userPhoneAvailable) {
        res.status(400).send("User has already registered with Phone Number!");
      }

      //Hash password
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
      if (!user) {
        res.status(500).send("Something went wrong registering the user");
      }

      res.status(200).send("Successfully registered");
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get all users
//@route GET /api/users
//@access private
const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const role = await Role.findById(req.user.role_id);
    if (role.roleName !== "Admin") {
      res.status(403);
      throw new Error("Only Admin have permission to see all User");
    }
    const users = await User.find().populate("role_id").exec();
    if (users.length === 0) {
      res.status(404);
      throw new Error("Website don't have any member!");
    }
    res.status(200).json(users);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get all users
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Block User
//@route GET /api/users/blocked/:id
//@access private
const blockUsers = asyncHandler(async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }
    if (req.user.roleName !== "Admin") {
      res.status(403);
      throw new Error("Only admins can block users!");
    }
    const blockUsers = await User.findByIdAndUpdate(user_id, {
      status: false,
    });
    if (!blockUsers) {
      res.status(500);
      throw new Error("Something went wrong in blockUsers");
    }
    res.status(200).json({ message: "Blocked successfully" });
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Current User Info
//@route GET /api/users/current
//@access private
const searchUserByName = asyncHandler(async (req, res, next) => {
  try {
    const lastName = req.query.lastName;
    if (!lastName || lastName === undefined) {
      res.status(500);
      throw new Error(
        "Something went wrong when pass query to searchUserByName"
      );
    }
    User.find(
      { lastName: { $regex: lastName, $options: "i" } },
      (err, users) => {
        if (err) {
          // Handle error
          res.status(500);
          throw new Error(err.message);
        } else {
          // Send the results as a JSON response to the client
          res.json(users);
        }
      }
    );
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(err.message || "Internal Server Error");
  }
});

//@desc Get user
//@route GET /api/users/:id
//@access private
const getUserById = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("role_id").exec();
    if (!user) {
      res.status(404);
      throw new Error("User Not Found!");
    }
    const userEmail = user.email;
    if (!(req.user.email === userEmail || req.user.roleName === "Admin")) {
      res.status(403);
      throw new Error("You don't have permission to get user's profile");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(res.statusCode).send(error.message || "Internal Server Error");
  }
});

//@desc Update user
//@route PUT /api/users/:id
//@access private
const updateUsers = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User Not Found!");
    }
    const {
      firstName,
      lastName,
      gender,
      dob,
      address,
      address_details,
      phone,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !dob ||
      !address ||
      !address_details ||
      !phone
    ) {
      res.status(400);
      throw new Error("All field not be empty!");
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
        throw new Error("This Phone has already Exist!");
      }
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updateUser);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Delete user
//@route DELETE /api/users/:id
//@access private
const deleteUsers = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User Not Found!");
    }
    if (req.user.roleName !== "Admin") {
      res.status(403);
      throw new Error("You don't have permission to update user's profile");
    }
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json(user);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc update Role of user to Accommodation
//@route GET /api/users/upRoleAccommodation/:id
//@access private
const updateRoleToAccommodation = asyncHandler(async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404);
      throw new Error("User not Found!");
    }
    if (req.user.roleName !== "Admin") {
      res.status(403);
      throw new Error("Only Admin can update role of User to Accommodation");
    }
    const updateRole = await User.findByIdAndUpdate(
      user_id,
      {
        role_id: "63e4736f62bf96d8df480f5a",
      },
      { new: true }
    );
    if (!updateRole) {
      res.status(500);
      throw new Error(
        "Something when wrong in update Role User to Accommodation!"
      );
    }
    res.status(200).json(updateRole);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});
//@desc update Role of user to Owner
//@route GET /api/users/upRoleOwner/:id
//@access private
const updateRoleToOwner = asyncHandler(async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404);
      throw new Error("User not Found!");
    }
    if (req.user.roleName !== "Admin") {
      res.status(403);
      throw new Error("Only Admin can update role of User to Owner");
    }
    const updateRole = await User.findByIdAndUpdate(
      user_id,
      {
        role_id: "648451b57a77eb17c8884d88",
      },
      { new: true }
    );
    if (!updateRole) {
      res.status(500);
      throw new Error("Something when wrong in update Role User to Owner!");
    }
    res.status(200).json(updateRole);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc User change password
//@route GET /api/users/checkOldPassword/:id
//@access private
const checkOldPassword = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const { password } = req.body;
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      res.status(401);
      throw new Error("Old password is incorrect");
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc User change password
//@route GET /api/users/changePassword/:id
//@access private
const changePassword = asyncHandler(async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404);
      throw new Error("User not Found!");
    }
    if (req.user.id !== user_id) {
      res.status(403);
      throw new Error("You don't have permission to change other password!");
    }
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      res.status(400);
      throw new Error("All field not be empty!");
    }
    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Password and confirm password are different!");
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      res.status(500);
      throw new Error(
        "Something when wrong in hashPassword of changePassword function!"
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
      throw new Error("Something when wrong in changePassword");
    }
    res.status(200).json(updatePassword);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc User update profile image
//@route GET /api/users/profile
//@access private
const updateAvatarUser = asyncHandler(async (req, res) => {
  try {
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
      throw new Error("Something wrong when wrong in updateProfile");
    }
    res.status(200).json(updateProfile);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(404);
      throw new Error("Email invalid");
    }
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpires = new Date();
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password OTP",
      html: `<body style="background-color:#ffffff;font-family:HelveticaNeue,Helvetica,Arial,sans-serif">
      <table
        align="center"
        role="presentation"
        cellSpacing="0"
        cellPadding="0"
        border="0"
        width="100%"
        style="max-width:37.5em;background-color:#ffffff;border:1px solid #eee;border-radius:5px;box-shadow:0 5px 10px rgba(20,50,70,.2);margin-top:20px;width:360px;margin:0 auto;padding:68px 0 130px"
      >
        <tr style="width:100%">
          <td>
            <img
              alt="Plaid"
              src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.15752-9/349327131_6368862009826485_8287991177646664794_n.png?_nc_cat=109&ccb=1-7&_nc_sid=ae9488&_nc_ohc=CFCOpGi4ZhYAX81sRTS&_nc_ht=scontent.fsgn19-1.fna&oh=03_AdTgMIlkh0evXvMFxRKsZfvMn2uZ81u3AmTt4qLoyLuPkw&oe=64A0D375"
              width="150"
              height="auto"
              style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto"
            />
            <p style="font-size:11px;line-height:16px;margin:16px 8px 8px 8px;color:#0a85ea;font-weight:700;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;height:16px;letter-spacing:0;text-transform:uppercase;text-align:center">
              Verify Your Email
            </p>
            <h1 style="color:#000;display:inline-block;font-family:HelveticaNeue-Medium,Helvetica,Arial,sans-serif;font-size:20px;font-weight:500;line-height:24px;margin-bottom:0;margin-top:0;text-align:center">
              Enter the following code to finish create account
            </h1>
            <table
              style="background:rgba(0,0,0,.05);border-radius:4px;margin:16px auto 14px;vertical-align:middle;width:280px"
              align="center"
              border="0"
              cellPadding="0"
              cellSpacing="0"
              role="presentation"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:32px;line-height:40px;margin:0 auto;color:#000;display:inline-block;font-family:HelveticaNeue-Bold;font-weight:700;letter-spacing:6px;padding-bottom:8px;padding-top:8px;width:100%;text-align:center">
                      ${otp}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <p style="font-size:15px;line-height:23px;margin:0;color:#444;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;letter-spacing:0;padding:0 40px;text-align:center">
              Not expecting this email?
            </p>
            <p style="font-size:15px;line-height:23px;margin:0;color:#444;font-family:HelveticaNeue,Helvetica,Arial,sans-serif;letter-spacing:0;padding:0 40px;text-align:center">
              Contact
              <a
                target="_blank"
                style="color:#444;text-decoration:underline"
                href="mailto:infor.driveconn@gmail.com.com"
              >
                infor.driveconn@gmail.com
              </a>
              if you did not request this code.
            </p>
          </td>
        </tr>
      </table>
    </body>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    res.status(200).json("OTP sent to email");
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const forgotPasswordSMS = async (req, res) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpires = new Date();
    await user.save();

    const client = twilio(accountSid, authToken);
    await client.messages.create({
      to: `+84${user.phone}`,
      from: twilioPhoneNumber,
      body: `Your OTP for resetting your password is: ${otp}`,
    });
    res.status(200).send({ userId: user.id });
  } catch (err) {
    res
      .status(res.statusCode || 500)
      .send(err.message || "Internal Server Error");
  }
};

const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(404);
      throw new Error("Invalid email or otp");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.otp.toString() !== otp) {
      res.status(400);
      throw new Error("Wrong OTP! Please try again");
    }
    const currentTime = moment(new Date());
    const otpExpires = moment(user.otpExpires);
    const isExpired = currentTime.diff(otpExpires, "minutes");
    if (isExpired > 10) {
      res.status(400);
      throw new Error("OTP is expired! Please try again");
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
        "Something went wrong when updating new password in reset password!"
      );
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password Successfully",
      text: `This is your new password: ${newPassword}. Please login to continue!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    res.status(200).json("Reset password successfully");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .send(error.message || "Internal Server Error");
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
  updateRoleToAccommodation,
  updateRoleToOwner,
  checkOldPassword,
  changePassword,
  updateAvatarUser,
  forgotPassword,
  resetPassword,
  forgotPasswordSMS,
  sendOTPWhenRegister,
  verifyOTPWhenRegister,
};
