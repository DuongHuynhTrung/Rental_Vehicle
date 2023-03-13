const express = require('express');
const bodyParser = require('body-parser');
const filterRouter = express.Router();
filterRouter.use(bodyParser.json());
const {
  getVehicleByVehicleManufacturer,
  getVehicleByPrice,
  getVehicleByTypes,
} = require('../app/controllers/FilterController');

/**
 * @swagger
 * /api/filters/manufacturer:
 *  get:
 *    tags:
 *      - Filters
 *    summary: Filter vehicles by manufacturer
 *    description: Retrieve a list of Vehicle with manufacturer
 *    parameters:
 *      - name: manufacturer
 *        in: query
 *        description: The manufacturer to search for
 *        Required: true
 *        schema:
 *          type: string
 *        example: Honda
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
 *        description: Don't have any vehicle with that manufacturer
 *
 */
filterRouter.route('/manufacturer').get(getVehicleByVehicleManufacturer);

/**
 * @swagger
 * /api/filters/price:
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
filterRouter.route('/price').get(getVehicleByPrice);

/**
 * @swagger
 * /api/filters/price:
 *  get:
 *    tags:
 *      - Filters
 *    summary: Filter vehicles by multiple types
 *    description: Retrieve a list of Vehicle with types in the list
 *    parameters:
 *      - name: types
 *        in: query
 *        description: Types of vehicle to search for
 *        Required: true
 *        schema:
 *          type: string
 *        example: Xe tay côn,4 chỗ
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
 *        description: No Vehicle found
 *      500:
 *        description: Error in filtering vehicle by type
 *
 */
filterRouter.route('/types').get(getVehicleByTypes);

module.exports = filterRouter;
