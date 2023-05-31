const express = require('express');
const authRouter = express.Router();
const loginLimiter = require('../app/middleware/loginLimiter');
const passport = require('passport');
const {
  login,
  refresh,
  logout,
  loginOauth,
} = require('../app/controllers/AuthController');

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    tags:
 *      - Authentications
 *    summary: Login with email & password to get accessToken in 15m
 *    description: Login with email & password to get accessToken in 15m (Throw Error if login more than 5 times in 1 minute)
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                  type: string
 *                  description: enter your email
 *                  example: trungduong@gmail.com
 *               password:
 *                  type: string
 *                  description: enter your password
 *                  example: 123456
 *    responses:
 *      200:
 *        description: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJOYW1lIjoiRHVvbmciLCJlbWFpbCI6InRydW5nZHVvbmdAZ21haWwuY29tIiwiaWQiOiI2M2UwODNhYjVjMTYyMzcwNjU2YTE0OTQifSwiaWF0IjoxNjc1ODQxNzE0LCJleHAiOjE2NzU4NDI2MTR9.cDeimio_-xU9HmdJ5E0DemwjHnCPKhnE6nIraNOv81g
 *      401:
 *        description: Email or Password is not Valid!
 *      429:
 *        description: Too many login attempts from this IP, please try again after a 60 second pause
 *
 */

authRouter.route('/login').post(loginLimiter, login);

/**
 * @swagger
 * /api/auth/refresh:
 *  get:
 *    tags:
 *      - Authentications
 *    summary: Refresh Access token by checking valid cookie
 *    description: Refresh Access token by checking valid cookie
 *    responses:
 *      200:
 *        description: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJOYW1lIjoiRHVvbmciLCJlbWFpbCI6InRydW5nZHVvbmdAZ21haWwuY29tIiwiaWQiOiI2M2UwODNhYjVjMTYyMzcwNjU2YTE0OTQifSwiaWF0IjoxNjc1ODQxNzE0LCJleHAiOjE2NzU4NDI2MTR9.cDeimio_-xU9HmdJ5E0DemwjHnCPKhnE6nIraNOv81g
 *      401:
 *        description: Email or Password is not Valid!
 *      403:
 *        description: Something wrong in refresh Token method
 *
 */

authRouter.route('/refresh').get(refresh);

/**
 * @swagger
 * /api/auth/logout:
 *  post:
 *    tags:
 *      - Authentications
 *    summary: Logout the website and Clear Cookie
 *    description: Logout the website and Clear Cookie
 *    responses:
 *      200:
 *        description: Cookie cleared!
 *      204:
 *        description: No Content!
 *
 */

authRouter.route('/logout').post(logout);

/* FACEBOOK ROUTER */
authRouter.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: ['profile', 'email'] })
);

authRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    res.send(req.user);
  }
);

/* GOOGLE ROUTER */

/**
 * @swagger
 * /api/auth/login/google:
 *  get:
 *    tags:
 *      - Authentications
 *    summary: Login with Google
 *    description: User is authenticated with Google account
 *    responses:
 *      200:
 *        description: Access Token returned
 *      204:
 *        description: No Content!
 *
 */

authRouter.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get('/login/authOauth', loginOauth);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureMessage: true,
    successRedirect: 'http://localhost:3000/home',
  })
  // loginOauth
  // function (req, res) {
  //   res.send(req.user);
  // }
);

module.exports = authRouter;
