const express = require("express");
const bodyParser = require("body-parser");
const carRouter = express.Router();
const multer = require("multer");

const {
  getCarsOfUser,
  getAllCars,
  registerCar,
  getCarByLicensePlate,
  updateCars,
  deleteCars,
  uploadCarFromExcel,
} = require("../app/controllers/CarController");
const { validateToken } = require("../app/middleware/validateTokenHandler");

carRouter.use(bodyParser.json());

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Car:
 *        type: object
 *        properties:
 *          user_id:
 *            type: object
 *            description: User's Id
 *          name:
 *            type: string
 *            description: Name of the car
 *          licensePlates:
 *            type: string
 *            description: Car's licensePlates
 *            example: HE46-48261
 *          desc:
 *            type: string
 *            description: Car's description
 *            example: xe mới còn dùng tốt
 *          autoMaker_id:
 *            type: ObjectId
 *            description: Car's autoMaker
 *            example: xe mới còn dùng tốt
 *          model_id:
 *            type: ObjectId
 *            description: Car's Model
 *            example: xe mới còn dùng tốt
 *          insurance:
 *            type: string
 *            description: Car's insurance
 *            example: 2 năm
 *          price:
 *            type: number
 *            description: Car's price
 *            example: 500000
 *          fuel:
 *            type: string
 *            description: Car's fuel
 *            example: Gas
 *          isRented:
 *            type: boolean
 *            description: please check is car rented
 *            example: true
 */

/**
 * @swagger
 * /api/cars/home:
 *  get:
 *    tags:
 *      - cars
 *    summary: Retrieve a list of car for home page
 *    description: Retrieve a list of cars from car table
 *    responses:
 *      200:
 *        description: A list of cars.
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
 *                    $ref: '#/components/schemas/car'
 *      404:
 *        description: Website don't have any car!
 *
 */

carRouter.route("/home").get(getAllCars);

/**
 * @swagger
 * /api/cars/{licensePlate}:
 *  get:
 *    tags:
 *      - cars
 *    summary: Retrieve a cars by car licensePlate
 *    description: Retrieve a cars by car licensePlate
 *    parameters:
 *      - name: licensePlate
 *        in: path
 *        required: true
 *        description: car licensePlate
 *        type: string
 *    responses:
 *      200:
 *        description: car information
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: Successfully fetched car's data!
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/car'
 *      403:
 *        description: You don't have permission to update car's profile
 *      404:
 *        description: User Not Found!
 *
 */

carRouter.route("/:licensePlate").get(getCarByLicensePlate);

carRouter.use(validateToken);
carRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })

  /**
   * @swagger
   * /api/cars:
   *  get:
   *    tags:
   *      - cars
   *    summary: Retrieve a list cars of User
   *    description: Retrieve a list cars of User from car table
   *    responses:
   *      200:
   *        description: A list cars of User.
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
   *                    $ref: '#/components/schemas/car'
   *      404:
   *        description: User don't register any car!
   *
   */

  .get(getCarsOfUser)

  /**
   * @swagger
   * /api/cars:
   *  post:
   *    tags:
   *      - cars
   *    summary: Register new car
   *    description: Register new car
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                licensePlates:
   *                  type: string
   *                  description: Car's licensePlates
   *                  example: HE46-48261
   *                description:
   *                  type: string
   *                  description: Car's description
   *                  example: xe mới còn dùng tốt
   *                insurance:
   *                  type: string
   *                  description: Car's insurance
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
   *                    $ref: '#/components/schemas/car'
   *      400:
   *        description: All field not be empty! OR car has already registered with License Plates! OR car data is not Valid!
   *
   */

  .post(registerCar);

carRouter
  .route("/:licensePlate")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })

  /**
   * @swagger
   * /api/cars/{licensePlate}:
   *  put:
   *    tags:
   *      - cars
   *    summary: Update car by car licensePlate
   *    description: Update car by car licensePlate
   *    parameters:
   *      - name: licensePlate
   *        in: path
   *        required: true
   *        description: car licensePlate
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
   *                  description: Car's description
   *                  example: xe mới còn dùng tốt
   *               insurance:
   *                  type: string
   *                  description: Car's insurance
   *                  example: 2 năm
   *    responses:
   *      200:
   *        description: car information updated
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully update car's data!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/car'
   *      400:
   *        description: All field not be empty!
   *      403:
   *        description: You don't have permission to delete car's information
   *      404:
   *        description: car Not Found
   *
   */

  .put(updateCars)

  /**
   * @swagger
   * /api/cars/{licensePlate}:
   *  delete:
   *    tags:
   *      - cars
   *    summary: Delete car by car licensePlate
   *    description: Delete car by car licensePlate
   *    parameters:
   *      - name: licensePlate
   *        in: path
   *        required: true
   *        description: car licensePlate
   *        type: string
   *    responses:
   *      200:
   *        description: Successfully deleted car
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully deleted car!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/car'
   *      403:
   *        description: You don't have permission to delete car's profile
   *      404:
   *        description: car Not Found!
   *
   */

  .delete(deleteCars);

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

carRouter.post("/upload", upload.single("excel"), uploadCarFromExcel);

module.exports = carRouter;
