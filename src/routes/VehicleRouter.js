const express = require('express');
const bodyParser = require('body-parser');
const vehicleRouter = express.Router();
const {
  getVehiclesOfUser,
  getAllVehicles,
  registerVehicle,
  getVehicleById,
  updateVehicles,
  deleteVehicles,
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
 *
 */

vehicleRouter.route('/home').get(getAllVehicles);

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
  .route('/:id')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'json/plain');
    next();
  })

  /**
   * @swagger
   * /api/vehicles/{id}:
   *  get:
   *    tags:
   *      - Vehicles
   *    summary: Retrieve a vehicles by vehicle id
   *    description: Retrieve a vehicles by vehicle id
   *    parameters:
   *      - name: id
   *        in: path
   *        required: true
   *        description: Vehicle id
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

  .get(getVehicleById)

  /**
   * @swagger
   * /api/vehicles/{id}:
   *  put:
   *    tags:
   *      - Vehicles
   *    summary: Update vehicle by vehicle id
   *    description: Update vehicle by vehicle id
   *    parameters:
   *      - name: id
   *        in: path
   *        required: true
   *        description: Vehicle id
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
   * /api/vehicles/{id}:
   *  delete:
   *    tags:
   *      - Vehicles
   *    summary: Delete vehicle by vehicle id
   *    description: Delete vehicle by vehicle id
   *    parameters:
   *      - name: id
   *        in: path
   *        required: true
   *        description: vehicle id
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

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Vehicle_Details:
 *        type: object
 *        properties:
 *          vehicle_id:
 *            type: string
 *            description: enter vehicle_id
 *            example: 63e1c316e38361ec4c9eea7d
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
  .route('/vehicleDetails/:vehicle_id')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'json/plain');
    next();
  })

  /**
   * @swagger
   * /api/vehicles/vehicleDetails/{vehicle_id}:
   *  post:
   *    tags:
   *      - Vehicle Details
   *    summary: Create Vehicle Details for Vehicle
   *    description: Create Vehicle Details for Vehicle
   *    parameters:
   *      - name: vehicle_id
   *        in: path
   *        required: true
   *        description: vehicle id
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
   * /api/vehicles/vehicleDetails/{vehicle_id}:
   *  get:
   *    tags:
   *      - Vehicle Details
   *    summary: Retrieve a vehicle details by vehicle id
   *    description: Retrieve a vehicle details by vehicle id
   *    parameters:
   *      - name: vehicle_id
   *        in: path
   *        required: true
   *        description: Vehicle id
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

  .get(getVehicleDetailByVehicleID)

  /**
   * @swagger
   * /api/vehicles/vehicleDetails/{vehicle_id}:
   *  put:
   *    tags:
   *      - Vehicle Details
   *    summary: Update vehicle details by vehicle id
   *    description: Update vehicle details by vehicle id
   *    parameters:
   *      - name: vehicle_id
   *        in: path
   *        required: true
   *        description: Vehicle id
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
   * /api/vehicles/vehicleDetails/{vehicle_id}:
   *  delete:
   *    tags:
   *      - Vehicle Details
   *    summary: Delete vehicle by vehicle id
   *    description: Delete vehicle by vehicle id
   *    parameters:
   *      - name: id
   *        in: path
   *        required: true
   *        description: vehicle id
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

module.exports = vehicleRouter;
