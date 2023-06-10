const express = require("express");
const bodyParser = require("body-parser");
const motorbikeRouter = express.Router();
const multer = require("multer");

const {
  getMotorbikesOfUser,
  getAllMotorbikes,
  registerMotorbike,
  getMotorbikeByLicensePlate,
  updateMotorbikes,
  deleteMotorbikes,
  uploadMotorbikeFromExcel,
} = require("../app/controllers/MotorbikeController");
const { validateToken } = require("../app/middleware/validateTokenHandler");

motorbikeRouter.use(bodyParser.json());

/**
 *  @swagger
 *  components:
 *    schemas:
 *      motorbike:
 *        type: object
 *        properties:
 *          user_id:
 *            type: object
 *            description: User's Id
 *          name:
 *            type: string
 *            description: Name of the motorbike
 *          licensePlates:
 *            type: string
 *            description: motorbike's licensePlates
 *            example: HE46-48261
 *          desc:
 *            type: string
 *            description: motorbike's description
 *            example: xe mới còn dùng tốt
 *          autoMaker_id:
 *            type: ObjectId
 *            description: motorbike's autoMaker
 *            example: xe mới còn dùng tốt
 *          model_id:
 *            type: ObjectId
 *            description: motorbike's Model
 *            example: xe mới còn dùng tốt
 *          insurance:
 *            type: string
 *            description: motorbike's insurance
 *            example: 2 năm
 *          price:
 *            type: number
 *            description: motorbike's price
 *            example: 500000
 *          fuel:
 *            type: string
 *            description: motorbike's fuel
 *            example: Gas
 *          isRented:
 *            type: boolean
 *            description: please check is motorbike rented
 *            example: true
 */

/**
 * @swagger
 * /api/motorbikes/home:
 *  get:
 *    tags:
 *      - motorbikes
 *    summary: Retrieve a list of motorbike for home page
 *    description: Retrieve a list of motorbikes from motorbike table
 *    responses:
 *      200:
 *        description: A list of motorbikes.
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
 *                    $ref: '#/components/schemas/motorbike'
 *      404:
 *        description: Website don't have any motorbike!
 *
 */

motorbikeRouter.route("/home").get(getAllMotorbikes);

/**
 * @swagger
 * /api/motorbikes/{licensePlate}:
 *  get:
 *    tags:
 *      - motorbikes
 *    summary: Retrieve a motorbikes by motorbike licensePlate
 *    description: Retrieve a motorbikes by motorbike licensePlate
 *    parameters:
 *      - name: licensePlate
 *        in: path
 *        required: true
 *        description: motorbike licensePlate
 *        type: string
 *    responses:
 *      200:
 *        description: motorbike information
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: Successfully fetched motorbike's data!
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/motorbike'
 *      403:
 *        description: You don't have permission to update motorbike's profile
 *      404:
 *        description: User Not Found!
 *
 */

motorbikeRouter.route("/:licensePlate").get(getMotorbikeByLicensePlate);

motorbikeRouter.use(validateToken);
motorbikeRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })

  /**
   * @swagger
   * /api/motorbikes:
   *  get:
   *    tags:
   *      - motorbikes
   *    summary: Retrieve a list motorbikes of User
   *    description: Retrieve a list motorbikes of User from motorbike table
   *    responses:
   *      200:
   *        description: A list motorbikes of User.
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
   *                    $ref: '#/components/schemas/motorbike'
   *      404:
   *        description: User don't register any motorbike!
   *
   */

  .get(getMotorbikesOfUser)

  /**
   * @swagger
   * /api/motorbikes:
   *  post:
   *    tags:
   *      - motorbikes
   *    summary: Register new motorbike
   *    description: Register new motorbike
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                licensePlates:
   *                  type: string
   *                  description: motorbike's licensePlates
   *                  example: HE46-48261
   *                description:
   *                  type: string
   *                  description: motorbike's description
   *                  example: xe mới còn dùng tốt
   *                insurance:
   *                  type: string
   *                  description: motorbike's insurance
   *                  example: 2 năm
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
   *                    $ref: '#/components/schemas/motorbike'
   *      400:
   *        description: All field not be empty! OR motorbike has already registered with License Plates! OR motorbike data is not Valid!
   *
   */

  .post(registerMotorbike);

motorbikeRouter
  .route("/:licensePlate")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })

  /**
   * @swagger
   * /api/motorbikes/{licensePlate}:
   *  put:
   *    tags:
   *      - motorbikes
   *    summary: Update motorbike by motorbike licensePlate
   *    description: Update motorbike by motorbike licensePlate
   *    parameters:
   *      - name: licensePlate
   *        in: path
   *        required: true
   *        description: motorbike licensePlate
   *        type: string
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               description:
   *                  type: string
   *                  description: motorbike's description
   *                  example: xe mới còn dùng tốt
   *               insurance:
   *                  type: string
   *                  description: motorbike's insurance
   *                  example: 2 năm
   *    responses:
   *      200:
   *        description: motorbike information updated
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully update motorbike's data!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/motorbike'
   *      400:
   *        description: All field not be empty!
   *      403:
   *        description: You don't have permission to delete motorbike's information
   *      404:
   *        description: motorbike Not Found
   *
   */

  .put(updateMotorbikes)

  /**
   * @swagger
   * /api/motorbikes/{licensePlate}:
   *  delete:
   *    tags:
   *      - motorbikes
   *    summary: Delete motorbike by motorbike licensePlate
   *    description: Delete motorbike by motorbike licensePlate
   *    parameters:
   *      - name: licensePlate
   *        in: path
   *        required: true
   *        description: motorbike licensePlate
   *        type: string
   *    responses:
   *      200:
   *        description: Successfully deleted motorbike
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully deleted motorbike!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/motorbike'
   *      403:
   *        description: You don't have permission to delete motorbike's profile
   *      404:
   *        description: motorbike Not Found!
   *
   */

  .delete(deleteMotorbikes);

// Schema of motorbike Details
/**
 *  @swagger
 *  components:
 *    schemas:
 *      motorbike_Details:
 *        type: object
 *        properties:
 *          licensePlate:
 *            type: string
 *            description: enter licensePlate
 *            example: H5-26752
 *          motorbikeType:
 *            type: string
 *            description: motorbike type
 *            example: 4 chỗ
 *          manufacturer:
 *            type: string
 *            description: motorbike manufacturer
 *            example: Honda
 *          model:
 *            type: string
 *            description: motorbike model
 *            example: Honda City
 *          yearOfManufacturer:
 *            type: string
 *            description: motorbike year of manufacturer
 *            example: 2019
 *          fuelType:
 *            type: string
 *            description: motorbike fuel
 *            example: Xăng
 *          transmission:
 *            type: string
 *            description: motorbike transmission
 *            example: Động cơ 4 thì
 *
 */

//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

motorbikeRouter.post(
  "/upload",
  upload.single("excel"),
  uploadMotorbikeFromExcel
);

module.exports = motorbikeRouter;
