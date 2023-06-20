const express = require("express");
const bodyParser = require("body-parser");
const vehicleRouter = express.Router();
const multer = require("multer");

const {
  getVehiclesOfUser,
  getAllVehicles,
  getVehicleByLicensePlate,
} = require("../app/controllers/VehicleController");
const { validateToken } = require("../app/middleware/validateTokenHandler");

vehicleRouter.use(bodyParser.json());

/**
 *  @swagger
 *  components:
 *    schemas:
 *      vehicle:
 *        type: object
 *        properties:
 *          user_id:
 *            type: object
 *            description: User's Id
 *          name:
 *            type: string
 *            description: Name of the vehicle
 *          licensePlates:
 *            type: string
 *            description: vehicle's licensePlates
 *            example: HE46-48261
 *          description:
 *            type: string
 *            description: vehicle's description
 *            example: xe mới còn dùng tốt
 *          insurance:
 *            type: string
 *            description: vehicle's insurance
 *            example: 2 năm
 *          price:
 *            type: number
 *            description: vehicle's price
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
 *      - vehicles
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
 *                    $ref: '#/components/schemas/vehicle'
 *      404:
 *        description: Website don't have any vehicle!
 *
 */

vehicleRouter.route("/home").get(getAllVehicles);

/**
 * @swagger
 * /api/vehicles:
 *  get:
 *    tags:
 *      - vehicles
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
 *                    $ref: '#/components/schemas/vehicle'
 *      404:
 *        description: User don't register any vehicle!
 *
 */

vehicleRouter.route("/user").get(validateToken, getVehiclesOfUser);

/**
 * @swagger
 * /api/vehicles/{licensePlate}:
 *  get:
 *    tags:
 *      - vehicles
 *    summary: Retrieve a vehicles by vehicle licensePlate
 *    description: Retrieve a vehicles by vehicle licensePlate
 *    parameters:
 *      - name: licensePlate
 *        in: path
 *        required: true
 *        description: vehicle licensePlate
 *        type: string
 *    responses:
 *      200:
 *        description: vehicle information
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
 *                    $ref: '#/components/schemas/vehicle'
 *      404:
 *        description: Vehicle Not Found!
 *
 */

vehicleRouter.route("/:licensePlate").get(getVehicleByLicensePlate);
module.exports = vehicleRouter;
