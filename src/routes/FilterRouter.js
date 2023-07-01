const express = require("express");
const bodyParser = require("body-parser");
const filterRouter = express.Router();
filterRouter.use(bodyParser.json());
const {
  getVehiclesHaveInsurance,
  getVehiclesByPrice,
  getVehicleByTypes,
  getVehiclesNoMortgage,
  getVehicleByCategory,
  getVehicleByAutoMaker,
  getVehicleByModel,
  getCarsByTransmission,
  filterByAddress,
  getVehicleByAddress,
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

// /**
//  * @swagger
//  * /api/filters/types:
//  *  get:
//  *    tags:
//  *      - Filters
//  *    summary: Filter vehicles by multiple types
//  *    description: Retrieve a list of Vehicle with types in the list
//  *    parameters:
//  *      - name: types
//  *        in: query
//  *        description: Types of vehicle to search for
//  *        Required: true
//  *        schema:
//  *          type: string
//  *        example: Xe tay côn,4 chỗ
//  *    responses:
//  *      200:
//  *        description: A list of vehicles.
//  *        content:
//  *          application/json:
//  *            schema:
//  *              type: object

//  *              properties:
//  *                description:
//  *                  type: string
//  *                  example: Successfully fetched all data!
//  *                data:
//  *                  type: array
//  *                  items:
//  *                    $ref: '#/components/schemas/Vehicle'
//  *      400:
//  *        description: No Vehicle found
//  *      500:
//  *        description: Error in filtering vehicle by type
//  *
//  */
// filterRouter.route("/types").get(getVehicleByTypes);

module.exports = filterRouter;
