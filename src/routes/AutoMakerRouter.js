const express = require("express");
const bodyParser = require("body-parser");
const autoMakerRouter = express.Router();

const {
  getAllCarAutoMaker,
  createCarAutoMaker,
  deleteCarAutoMaker,
  getAllMotorbikeAutoMaker,
  createMotorbikeAutoMaker,
  deleteMotorbikeAutoMaker,
} = require("../app/controllers/AutoMakerController");
const {
  validateTokenAdmin,
  validateToken,
} = require("../app/middleware/validateTokenHandler");

autoMakerRouter.use(bodyParser.json());

/**
 *  @swagger
 *  components:
 *    schemas:
 *      CarAutoMaker:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            required: true
 *            description: Honda
 */

/**
 * @swagger
 * /api/autoMakers/cars:
 *  get:
 *    tags:
 *      - Car AutoMaker
 *    summary: Get all car autoMaker of system
 *    description: Get all car autoMaker of system
 *    responses:
 *      200:
 *        description: Return all car autoMaker of system
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: Get all car autoMaker of system
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/CarAutoMaker'
 *      404:
 *        description: Have no Car-AutoMaker found!
 *
 */

autoMakerRouter.route("/cars").get(getAllCarAutoMaker);

/**
 *  @swagger
 *  components:
 *    schemas:
 *      MotorbikeAutoMaker:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            required: true
 *            description: Honda
 */

/**
 * @swagger
 * /api/autoMakers/motorbikes:
 *  get:
 *    tags:
 *      - Motorbike AutoMaker
 *    summary: Get all motorbike autoMaker of system
 *    description: Get all motorbike autoMaker of system
 *    responses:
 *      200:
 *        description: Return all motorbike autoMaker of system
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: Get all motorbike autoMaker of system
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/MotorbikeAutoMaker'
 *      404:
 *        description: Have no Motorbike-AutoMaker found!
 *
 */

autoMakerRouter.route("/motorbikes").get(getAllMotorbikeAutoMaker);

autoMakerRouter.use(validateTokenAdmin);

autoMakerRouter
  .route("/cars")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })
  .post(createCarAutoMaker)
  .delete(deleteCarAutoMaker);

autoMakerRouter
  .route("/motorbikes")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })
  .post(createMotorbikeAutoMaker)
  .delete(deleteMotorbikeAutoMaker);

module.exports = autoMakerRouter;
