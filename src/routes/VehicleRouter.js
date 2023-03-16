const express = require('express');
const bodyParser = require('body-parser');
const vehicleRouter = express.Router();
const multer = require('multer');

const {
  getVehiclesOfUser,
  getAllVehicles,
  registerVehicle,
  getVehicleById,
  updateVehicles,
  deleteVehicles,
  uploadVehicleFromExcel,
} = require('../app/controllers/VehicleController');
const {
  createVehicleDetail,
  getVehicleDetailByVehicleID,
  updateVehicleDetailsByVehicleID,
  deleteVehicleDetailsByVehicleID,
} = require('../app/controllers/VehicleDetailsController');
const validateToken = require('../app/middleware/validateTokenHandler');

vehicleRouter.use(bodyParser.json());

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Vehicle:
 *        type: object
 *        properties:
 *          user_id:
 *            type: object
 *            description: User's Id
 *          licensePlates:
 *            type: string
 *            description: enter vehicle's licensePlates
 *            example: HE46-48261
 *          description:
 *            type: string
 *            description: enter vehicle's description
 *            example: xe mới còn dùng tốt
 *          insurance:
 *            type: string
 *            description: enter vehicle's insurance
 *            example: 2 năm
 *          price:
 *            type: number
 *            description: enter vehicle's price
 *            example: 500000
 *          isRented:
 *            type: boolean
 *            description: please check is vehicle rented
 *            example: true
 */

/**
 * @swagger
 * /api/vehicles/home:
 *  get:
 *    tags:
 *      - Vehicles
 *    summary: Retrieve a list of vehicle for home page
 *    description: Retrieve a list of vehicles from vehicle table
 *    responses:
 *      200:
 *        description: A list of vehicles.
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
 *                    $ref: '#/components/schemas/Vehicle'
 *      404:
 *        description: Website don't have any Vehicle!
 *
 */

vehicleRouter.route('/home').get(getAllVehicles);

/**
 * @swagger
 * /api/vehicles/{licensePlate}:
 *  get:
 *    tags:
 *      - Vehicles
 *    summary: Retrieve a vehicles by vehicle licensePlate
 *    description: Retrieve a vehicles by vehicle licensePlate
 *    parameters:
 *      - name: licensePlate
 *        in: path
 *        required: true
 *        description: Vehicle licensePlate
 *        type: string
 *    responses:
 *      200:
 *        description: Vehicle information
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: Successfully fetched vehicle's data!
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Vehicle'
 *      403:
 *        description: You don't have permission to update vehicle's profile
 *      404:
 *        description: User Not Found!
 *
 */

vehicleRouter.route('/:licensePlate').get(getVehicleById);

/**
 * @swagger
 * /api/vehicles/vehicleDetails/{licensePlate}:
 *  get:
 *    tags:
 *      - Vehicle Details
 *    summary: Retrieve a vehicle details by vehicle licensePlate
 *    description: Retrieve a vehicle details by vehicle licensePlate
 *    parameters:
 *      - name: licensePlate
 *        in: path
 *        required: true
 *        description: Vehicle licensePlate
 *        type: string
 *    responses:
 *      200:
 *        description: Vehicle Details information
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: Successfully fetched vehicle's details data!
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Vehicle_Details'
 *      404:
 *        description: Vehicle don't have Details. Please add one!
 *
 */

vehicleRouter
  .route('/vehicleDetails/:licensePlate')
  .get(getVehicleDetailByVehicleID);

vehicleRouter.use(validateToken);
vehicleRouter
  .route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'json/plain');
    next();
  })

  /**
   * @swagger
   * /api/vehicles:
   *  get:
   *    tags:
   *      - Vehicles
   *    summary: Retrieve a list vehicles of User
   *    description: Retrieve a list vehicles of User from vehicle table
   *    responses:
   *      200:
   *        description: A list vehicles of User.
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
   *                    $ref: '#/components/schemas/Vehicle'
   *      404:
   *        description: User don't register any Vehicle!
   *
   */

  .get(getVehiclesOfUser)

  /**
   * @swagger
   * /api/vehicles:
   *  post:
   *    tags:
   *      - Vehicles
   *    summary: Register new Customer
   *    description: Register new Customer
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                licensePlates:
   *                  type: string
   *                  description: enter vehicle's licensePlates
   *                  example: HE46-48261
   *                description:
   *                  type: string
   *                  description: enter vehicle's description
   *                  example: xe mới còn dùng tốt
   *                insurance:
   *                  type: string
   *                  description: enter vehicle's insurance
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
   *                    $ref: '#/components/schemas/Vehicle'
   *      400:
   *        description: All field not be empty! OR Vehicle has already registered with License Plates! OR Vehicle data is not Valid!
   *
   */

  .post(registerVehicle);

vehicleRouter
  .route('/:licensePlate')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'json/plain');
    next();
  })

  /**
   * @swagger
   * /api/vehicles/{licensePlate}:
   *  put:
   *    tags:
   *      - Vehicles
   *    summary: Update vehicle by vehicle licensePlate
   *    description: Update vehicle by vehicle licensePlate
   *    parameters:
   *      - name: licensePlate
   *        in: path
   *        required: true
   *        description: Vehicle licensePlate
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
   *                  description: enter vehicle's description
   *                  example: xe mới còn dùng tốt
   *               insurance:
   *                  type: string
   *                  description: enter vehicle's insurance
   *                  example: 2 năm
   *    responses:
   *      200:
   *        description: Vehicle information updated
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully update vehicle's data!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/Vehicle'
   *      400:
   *        description: All field not be empty!
   *      403:
   *        description: You don't have permission to delete vehicle's information
   *      404:
   *        description: Vehicle Not Found
   *
   */

  .put(updateVehicles)

  /**
   * @swagger
   * /api/vehicles/{licensePlate}:
   *  delete:
   *    tags:
   *      - Vehicles
   *    summary: Delete vehicle by vehicle licensePlate
   *    description: Delete vehicle by vehicle licensePlate
   *    parameters:
   *      - name: licensePlate
   *        in: path
   *        required: true
   *        description: vehicle licensePlate
   *        type: string
   *    responses:
   *      200:
   *        description: Successfully deleted vehicle
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully deleted vehicle!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/Vehicle'
   *      403:
   *        description: You don't have permission to delete vehicle's profile
   *      404:
   *        description: Vehicle Not Found!
   *
   */

  .delete(deleteVehicles);

// Schema of Vehicle Details
/**
 *  @swagger
 *  components:
 *    schemas:
 *      Vehicle_Details:
 *        type: object
 *        properties:
 *          licensePlate:
 *            type: string
 *            description: enter licensePlate
 *            example: H5-26752
 *          vehicleType:
 *            type: string
 *            description: enter vehicle type
 *            example: 4 chỗ
 *          manufacturer:
 *            type: string
 *            description: enter vehicle manufacturer
 *            example: Honda
 *          model:
 *            type: string
 *            description: enter vehicle model
 *            example: Honda City
 *          yearOfManufacturer:
 *            type: string
 *            description: enter vehicle year of manufacturer
 *            example: 2019
 *          fuelType:
 *            type: string
 *            description: enter vehicle fuel
 *            example: Xăng
 *          transmission:
 *            type: string
 *            description: enter vehicle transmission
 *            example: Động cơ 4 thì
 *
 */

vehicleRouter
  .route('/vehicleDetails/:licensePlate')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'json/plain');
    next();
  })

  /**
   * @swagger
   * /api/vehicles/vehicleDetails/{licensePlate}:
   *  post:
   *    tags:
   *      - Vehicle Details
   *    summary: Create Vehicle Details for Vehicle
   *    description: Create Vehicle Details for Vehicle
   *    parameters:
   *      - name: licensePlate
   *        in: path
   *        required: true
   *        description: vehicle licensePlate
   *        type: string
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                vehicleType:
   *                  type: string
   *                  description: enter vehicle type
   *                  example: 4 chỗ
   *                manufacturer:
   *                  type: string
   *                  description: enter vehicle manufacturer
   *                  example: Honda
   *                model:
   *                  type: string
   *                  description: enter vehicle model
   *                  example: Honda City
   *                yearOfManufacturer:
   *                  type: string
   *                  description: enter vehicle year of manufacturer
   *                  example: 2019
   *                fuelType:
   *                  type: string
   *                  description: enter vehicle fuel
   *                  example: Xăng
   *                transmission:
   *                  type: string
   *                  description: enter vehicle transmission
   *                  example: Động cơ 4 thì
   *    responses:
   *      201:
   *        description: Create Successfully!
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Create Successfully!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/Vehicle_Details'
   *      400:
   *        description: All field not be empty! OR This Vehicle has already have Vehicle's Details! OR Vehicle Details data is not Valid!
   *
   */

  .post(createVehicleDetail)

  /**
   * @swagger
   * /api/vehicles/vehicleDetails/{licensePlate}:
   *  put:
   *    tags:
   *      - Vehicle Details
   *    summary: Update vehicle details by vehicle licensePlate
   *    description: Update vehicle details by vehicle licensePlate
   *    parameters:
   *      - name: licensePlate
   *        in: path
   *        required: true
   *        description: Vehicle licensePlate
   *        type: string
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                vehicleType:
   *                  type: string
   *                  description: enter vehicle type
   *                  example: 4 chỗ
   *                manufacturer:
   *                  type: string
   *                  description: enter vehicle manufacturer
   *                  example: Honda
   *                model:
   *                  type: string
   *                  description: enter vehicle model
   *                  example: Honda City
   *                yearOfManufacturer:
   *                  type: string
   *                  description: enter vehicle year of manufacturer
   *                  example: 2019
   *                fuelType:
   *                  type: string
   *                  description: enter vehicle fuel
   *                  example: Xăng
   *                transmission:
   *                  type: string
   *                  description: enter vehicle transmission
   *                  example: Động cơ 4 thì
   *    responses:
   *      200:
   *        description: Vehicle Details information updated
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully update vehicle's details data!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/Vehicle_Details'
   *      400:
   *        description: All field not be empty!
   *      404:
   *        description: Vehicle don't have Details. Please add one!
   *
   */

  .put(updateVehicleDetailsByVehicleID)

  /**
   * @swagger
   * /api/vehicles/vehicleDetails/{licensePlate}:
   *  delete:
   *    tags:
   *      - Vehicle Details
   *    summary: Delete vehicle by vehicle licensePlate
   *    description: Delete vehicle by vehicle licensePlate
   *    parameters:
   *      - name: licensePlate
   *        in: path
   *        required: true
   *        description: vehicle licensePlate
   *        type: string
   *    responses:
   *      200:
   *        description: Successfully deleted vehicle
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Successfully deleted vehicle!
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/Vehicle'
   *      404:
   *        description: Vehicle don't have Details. Please add one!
   *
   */

  .delete(deleteVehicleDetailsByVehicleID);

//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

vehicleRouter.post('/upload', upload.single('excel'), uploadVehicleFromExcel);

module.exports = vehicleRouter;
