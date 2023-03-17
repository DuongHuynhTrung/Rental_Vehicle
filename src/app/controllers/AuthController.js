const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');

//@desc Login user
//@route POST /api/auth/login
//@access public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('All field not be empty!');
  }
  const user = await User.findOne({ email });
  //compare password to hashedPassword
  const matches = await bcrypt.compare(password, user.password);
  if (user && matches) {
    if (!user.status) {
      res.status(401);
      throw new Error(
        'User has already been blocked! Please contact the administrator!'
      );
    }
    const role_id = user.role_id.toString();
    const role = await Role.findById(role_id);
    const accessToken = jwt.sign(
      {
        user: {
          lastName: user.lastName,
          email: user.email,
          roleName: role.roleName,
          role_id: user.role_id,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          lastName: user.lastName,
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

//@desc Login google/facebook
//@route POST /api/auth/loginOauth
//@access public
const loginOauth = asyncHandler(async (req, res, next) => {
  const authUser = req.user;
  const user = await User.findOne({ oauth_id: authUser.oauth_id });
  //compare password to hashedPassword
  if (user) {
    if (!user.status) {
      res.status(401);
      throw new Error(
        'User has already been blocked! Please contact the administrator!'
      );
    }
    const role_id = user.role_id.toString();
    const role = await Role.findById(role_id);
    const accessToken = jwt.sign(
      {
        user: {
          lastName: user.lastName,
          email: user.email,
          roleName: role.roleName,
          role_id: user.role_id,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          lastName: user.lastName,
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
            lastName: user.lastName,
            email: user.email,
            roleName: role.roleName,
            role_id: user.role_id,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
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

// Google API
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        'https://rental-vehicle-na07.onrender.com/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      //get the user data from google
      const newUser = {
        oauth_id: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        imgURL: profile.photos[0].value,
        email: profile.emails[0].value,
        role_id: '63e4733e62bf96d8df480f59',
      };

      try {
        //find the user in our database
        let user = await User.findOne({ oauth_id: profile.id });

        if (user) {
          if (!user.status) {
            res.status(401);
            throw new Error(
              'User has already been blocked! Please contact the administrator!'
            );
          }
          const role_id = user.role_id.toString();
          const role = await Role.findById(role_id);
          const accessToken = jwt.sign(
            {
              user: {
                lastName: user.lastName,
                email: user.email,
                roleName: role.roleName,
                role_id: user.role_id,
                id: user.id,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
          );

          const refreshToken = jwt.sign(
            {
              user: {
                lastName: user.lastName,
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
          // res.cookie('jwt', refreshToken, {
          //   httpOnly: true, //accessible only by web server
          //   secure: true, //https
          //   sameSite: 'None', //cross-site cookie
          //   maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
          // });

          // res.status(200).json({ accessToken });
          done(null, { accessToken });
        } else {
          // if user is not preset in our database save user data to database.
          user = await User.create(newUser);
          if (!user.status) {
            res.status(401);
            throw new Error(
              'User has already been blocked! Please contact the administrator!'
            );
          }
          const role_id = user.role_id.toString();
          const role = await Role.findById(role_id);
          const accessToken = jwt.sign(
            {
              user: {
                lastName: user.lastName,
                email: user.email,
                roleName: role.roleName,
                role_id: user.role_id,
                id: user.id,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
          );

          const refreshToken = jwt.sign(
            {
              user: {
                lastName: user.lastName,
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
          // res.cookie('jwt', refreshToken, {
          //   httpOnly: true, //accessible only by web server
          //   secure: true, //https
          //   sameSite: 'None', //cross-site cookie
          //   maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
          // });
          done(null, { accessToken });
        }
      } catch (err) {
        console.error(err);
      }
    }
  )
);

//Facebook API
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:5001/api/auth/facebook/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      //get the user data from google
      const newUser = {
        oauth_id: profile.id,
        firstName: profile.name.familyName,
        lastName: profile.name.givenName,
        imgURL: profile.photos[0].value,
        email: profile.emails[0].value,
        role_id: '63e4733e62bf96d8df480f59',
      };

      try {
        //find the user in our database
        let user = await User.findOne({ oauth_id: profile.id });

        if (user) {
          //If user present in our database.
          done(null, user);
        } else {
          // if user is not preset in our database save user data to database.
          const userEmailAvailable = await User.findOne({ email });
          if (userEmailAvailable) {
            res.status(400);
            throw new Error('User has already registered with Email!');
          }
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.error(err);
      }
    }
  )
);

// used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = { login, refresh, logout, loginOauth };
