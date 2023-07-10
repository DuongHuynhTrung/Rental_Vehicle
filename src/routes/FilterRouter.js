const express = require("express");
const bodyParser = require("body-parser");
const filterRouter = express.Router();
filterRouter.use(bodyParser.json());
const {
  getVehiclesHaveInsurance,
  getVehiclesByPrice,
  getVehiclesNoMortgage,
  getVehicleByCategory,
  getVehicleByAutoMaker,
  getVehicleByModel,
  getCarsByTransmission,
  getVehicleByAddress,
  getVehicleByFuel,
  getVehicleByDate,
} = require("../app/controllers/FilterController");

/**
 * @swagger
 * /api/filters/vehicles/insurance:
 *  get:
 *    tags:
 *      - Filters
 *    summary: Filter cars by insurance
 *    description: Retrieve a list of cars with insurance
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
 *                    $ref: '#/components/schemas/Vehicle'
 *      404:
 *        description: Don't have any vehicle with that manufacturer
 *
 */
filterRouter.route("/vehicles/insurance").get(getVehiclesHaveInsurance);

/**
 * @swagger
 * /api/filters/vehicles/mortgage:
 *  get:
 *    tags:
 *      - Filters
 *    summary: Filter cars by mortgage
 *    description: Retrieve a list of cars with mortgage
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
 *                    $ref: '#/components/schemas/Vehicle'
 *      404:
 *        description: Don't have any vehicle with that manufacturer
 *
 */
filterRouter.route("/vehicles/mortgage").get(getVehiclesNoMortgage);

/**
 * @swagger
 * /api/filters/vehicles/price:
 *  get:
 *    tags:
 *      - Filters
 *    summary: Filter vehicles by price
 *    description: Retrieve a list of Vehicle with price in range
 *    parameters:
 *      - name: minPrice
 *        in: query
 *        description: Minimum price to search for
 *        Required: true
 *        schema:
 *          type: number
 *        example: 500000
 *      - name: maxPrice
 *        in: query
 *        description: Maximum price to search for
 *        Required: true
 *        schema:
 *          type: number
 *        example: 600000
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
 *      400:
 *        description: Invalid price range input
 *      500:
 *        description: Error in filter vehicle by price
 *
 */
filterRouter.route("/vehicles/price").get(getVehiclesByPrice);

filterRouter.route("/vehicles/category").get(getVehicleByCategory);

filterRouter.route("/vehicles/autoMaker").get(getVehicleByAutoMaker);

filterRouter.route("/vehicles/model").get(getVehicleByModel);

filterRouter.route("/cars/transmission").get(getCarsByTransmission);

filterRouter.route("/vehicles/address").get(getVehicleByAddress);

filterRouter.route("/vehicles/fuel").get(getVehicleByFuel);

filterRouter.route("/vehicles/date").get(getVehicleByDate);

module.exports = filterRouter;
