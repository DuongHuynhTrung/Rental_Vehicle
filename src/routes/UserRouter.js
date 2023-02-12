const express = require('express');
const bodyParser = require('body-parser');
const userRouter = express.Router();
userRouter.use(bodyParser.json());
const {
  registerUser,
  getUsers,
  getUserById,
  updateUsers,
  deleteUsers,
  currentUserInfo,
} = require('../app/controllers/UserController');
const {
  getDrivingLicenseOfUser,
  registerDrivingLicense,
  updateDrivingLicense,
  deleteDrivingLicense,
} = require('../app/controllers/DrivingLicenseController');
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

userRouter.use(validateToken);

//Router for Admin to getUsers
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

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Driving_License:
 *        type: object
 *        properties:
 *          user_id:
 *            type: object
 *            description: User's Id
 *          licenseNo:
 *            type: number
 *            description: enter driving license number
 *            example: 21411949315
 *          licenseClass:
 *            type: string
 *            description: enter driving license class
 *            example: A1
 *          expireDate:
 *            type: string
 *            description: enter driving license expireDate
 *            example: 22/01/2023
 */

//Router for CRUD Driving License
userRouter
  .route('/drivingLicense')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'json/plain');
    next();
  })

  /**
   * @swagger
   * /api/users/drivingLicense:
   *  get:
   *    tags:
   *      - Driving License
   *    summary: Retrieve a driving License of user
   *    description: Retrieve a driving License of user
   *    responses:
   *      200:
   *        description: Retrieve a driving License of user
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully fetched data!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/Driving_License'
   *      404:
   *        description: User doesn't register Driving License!
   *
   */

  .get(getDrivingLicenseOfUser)

  /**
   * @swagger
   * /api/users/drivingLicense:
   *  post:
   *    tags:
   *      - Driving License
   *    summary: Register new Driving License for User
   *    description: Register new Driving License for User
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                licenseNo:
   *                  type: number
   *                  description: enter driving license number
   *                  example: 21411949315
   *                licenseClass:
   *                  type: string
   *                  description: enter driving license class
   *                  example: A1
   *                expireDate:
   *                  type: string
   *                  description: enter driving license expireDate
   *                  example: 22/01/2023
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
   *                    $ref: '#/components/schemas/Vehicle'
   *      400:
   *        description: All field not be empty! OR Vehicle has already registered with License Plates! OR Vehicle data is not Valid!
   *
   */

  .post(registerDrivingLicense)

  /**
   * @swagger
   * /api/users/drivingLicense:
   *  put:
   *    tags:
   *      - Driving License
   *    summary: Update driving License for user by user id
   *    description: Update driving License for user by user id
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                licenseNo:
   *                  type: number
   *                  description: enter driving license number
   *                  example: 21411949315
   *                licenseClass:
   *                  type: string
   *                  description: enter driving license class
   *                  example: A1
   *                expireDate:
   *                  type: string
   *                  description: enter driving license expireDate
   *                  example: 22/01/2023
   *    responses:
   *      200:
   *        description: Driving License information updated
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully update drivingLicense's data!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/Driving_License'
   *      400:
   *        description: All field not be empty!
   *      403:
   *        description: You don't have permission to update drivingLicense's information!
   *      404:
   *        description: User doesn't register Driving License!
   *
   */

  .put(updateDrivingLicense)

  /**
   * @swagger
   * /api/users/drivingLicense:
   *  delete:
   *    tags:
   *      - Driving License
   *    summary: Delete driving License for User by user id
   *    description: Delete driving License for User by user id
   *    responses:
   *      200:
   *        description: Successfully deleted Driving License
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully deleted Driving License!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/Driving_License'
   *      403:
   *        description: You don't have permission to delete other drivingLicense!
   *      404:
   *        description: User doesn't register Driving License!
   *
   */

  .delete(deleteDrivingLicense);

//Router for getUserByID, updateUser, deleteUser
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
