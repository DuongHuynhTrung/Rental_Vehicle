const express = require('express');
const bodyParser = require('body-parser');
const vehicleRouter = express.Router();
const {
  getVehicles,
  registerVehicle,
  getVehicleById,
  updateVehicles,
  deleteVehicles,
} = require('../app/controllers/VehicleController');
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
   *    summary: Retrieve a list of vehicle
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

  .get(getVehicles)

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

module.exports = vehicleRouter;
