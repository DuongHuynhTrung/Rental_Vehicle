const express = require('express');
const bodyParser = require('body-parser');
const userRouter = express.Router();
userRouter.use(bodyParser.json());
const {
  getUsers,
  registerUser,
  getUserById,
  updateUsers,
  deleteUsers,
  loginUser,
  currentUserInfo,
} = require('../app/controllers/UserController');
const validateToken = require('../app/middleware/validateTokenHandler');

/**
 *  @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          firstName:
 *            type: string
 *            description: enter your first name
 *            example: Trung
 *          lastName:
 *            type: string
 *            description: enter your last name
 *            example: Duong
 *          gender:
 *            type: string
 *            description: enter your gender
 *            example: Male
 *          dob:
 *            type: string
 *            description: enter your dob
 *            example: 22/02/2001
 *          address:
 *            type: string
 *            description: enter your address
 *            example: Ho Chi Minh
 *          phone:
 *            type: string
 *            description: enter your phone
 *            example: 0838323403
 *          email:
 *            type: string
 *            description: enter your email
 *            example: trungduong@gmail.com
 *          password:
 *            type: string
 *            description: enter your password
 *            example: 123456
 *          role_id:
 *            type: string
 *            description: enter your role_id
 *            example: Customer
 */

/**
 * @swagger
 * /api/users/register:
 *  post:
 *    tags:
 *      - Users
 *    summary: Register new Customer
 *    description: Register new Customer
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                  type: string
 *                  description: enter your first name
 *                  example: Trung
 *               lastName:
 *                  type: string
 *                  description: enter your last name
 *                  example: Duong
 *               gender:
 *                  type: string
 *                  description: enter your gender
 *                  example: Male
 *               dob:
 *                  type: string
 *                  description: enter your dob
 *                  example: 22/02/2001
 *               address:
 *                  type: string
 *                  description: enter your address
 *                  example: Ho Chi Minh
 *               phone:
 *                  type: string
 *                  description: enter your phone
 *                  example: 0838323403
 *               email:
 *                  type: string
 *                  description: enter your email
 *                  example: trungduong@gmail.com
 *               password:
 *                  type: string
 *                  description: enter your password
 *                  example: 123456
 *    responses:
 *      201:
 *        description:  Register Successfully!
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: Register Successfully!
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/User'
 *      400:
 *        description: All field not be empty! OR User has already registered with Email! OR User has already registered with Phone Number! OR User data is not Valid!
 *
 */

userRouter.route('/register').post(registerUser);

/**
 * @swagger
 * /api/users/login:
 *  post:
 *    tags:
 *      - Users
 *    summary: Login with email & password
 *    description: Login with email & password to get accessToken in 15m
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
 *
 */

userRouter.route('/login').post(loginUser);
userRouter.use(validateToken);

userRouter
  .route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'json/plain');
    next();
  })

  /**
   * @swagger
   * /api/users:
   *  get:
   *    tags:
   *      - Users
   *    summary: Retrieve a list of users
   *    description: Retrieve a list of users from users table. Only Admin with mail admin@gmail.com can access this path
   *    responses:
   *      200:
   *        description: A list of users.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully fetched all data!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/User'
   *      403:
   *        description: Only Admin have permission to see all User
   *
   */

  .get(getUsers);

userRouter.get('/current', currentUserInfo);

userRouter
  .route('/:id')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'json/plain');
    next();
  })

  /**
   * @swagger
   * /api/users/{id}:
   *  get:
   *    tags:
   *      - Users
   *    summary: Retrieve a users by user id
   *    description: Retrieve a users by user id
   *    parameters:
   *      - name: id
   *        in: path
   *        required: true
   *        description: User id
   *        type: string
   *    responses:
   *      200:
   *        description: User information
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully fetched user's data!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/User'
   *      403:
   *        description: You don't have permission to update user's profile
   *      404:
   *        description: User Not Found!
   *
   */

  .get(getUserById)

  /**
   * @swagger
   * /api/users/{id}:
   *  put:
   *    tags:
   *      - Users
   *    summary: Update user by user id
   *    description: Update user by user id
   *    parameters:
   *      - name: id
   *        in: path
   *        required: true
   *        description: User id
   *        type: string
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                  type: string
   *                  description: enter your first name
   *                  example: Trung
   *               lastName:
   *                  type: string
   *                  description: enter your last name
   *                  example: Duong
   *               gender:
   *                  type: string
   *                  description: enter your gender
   *                  example: Male
   *               dob:
   *                  type: string
   *                  description: enter your dob
   *                  example: 22/02/2001
   *               address:
   *                  type: string
   *                  description: enter your address
   *                  example: Ho Chi Minh
   *               password:
   *                  type: string
   *                  description: enter your password
   *                  example: 123456
   *    responses:
   *      200:
   *        description: User information updated
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully update user's data!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/User'
   *      400:
   *        description: This Phone has already Exist! OR All field not be empty!
   *      403:
   *        description: You don't have permission to delete user's profile
   *      404:
   *        description: User Not Found
   *
   */

  .put(updateUsers)

  /**
   * @swagger
   * /api/users/{id}:
   *  delete:
   *    tags:
   *      - Users
   *    summary: Delete user by user id
   *    description: Delete user by user id
   *    parameters:
   *      - name: id
   *        in: path
   *        required: true
   *        description: User id
   *        type: string
   *    responses:
   *      200:
   *        description: Successfully deleted user
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully deleted user!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/User'
   *      403:
   *        description: You don't have permission to delete user's profile
   *      404:
   *        description: User Not Found!
   *
   */

  .delete(deleteUsers);

module.exports = userRouter;
