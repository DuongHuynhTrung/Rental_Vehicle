const asyncHandler = require('express-async-handler');
const User = require('../modules/User');
const Role = require('../modules/Role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//@desc Login user
//@route POST /api/users/login
//@access public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('All field not be empty!');
  }
  const user = await User.findOne({ email });
  //compare password to hashedPassword
  if (user && bcrypt.compare(password, user.password)) {
    const role_id = user.role_id.toString();
    const role = await Role.findById(role_id);
    const accessToken = jwt.sign(
      {
        user: {
          userName: user.lastName,
          email: user.email,
          roleName: role.roleName,
          role_id: user.role_id,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          userName: user.lastName,
          email: user.email,
          roleName: role.roleName,
          role_id: user.role_id,
          id: user.id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: 'None', //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error('Email or Password is not Valid!');
  }
});

// @desc Refresh Token
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.status(401);
    throw new Error('Cookies wrong!');
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        res.status(403);
        throw new Error('Something wrong in refreshToken!');
      }
      const user = await User.findOne({ email: decoded.user.email });

      if (!user) {
        res.status(401);
        throw new Error('Email or Password is not Valid!');
      }

      const role_id = user.role_id.toString();
      const role = await Role.findById(role_id);
      const accessToken = jwt.sign(
        {
          user: {
            userName: user.lastName,
            email: user.email,
            roleName: role.roleName,
            role_id: user.role_id,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      res.json({ accessToken });
    })
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.sendStatus(204);
    throw new Error('No Content!');
  }
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.status(200).json({ message: 'Cookie cleared' });
};

module.exports = { login, refresh, logout };
