const express = require("express");
const bodyParser = require("body-parser");
const modelRouter = express.Router();

const {
  getAllCarModel,
  createCarModel,
  deleteCarModel,
  getAllMotorbikeModel,
  createMotorbikeModel,
  deleteMotorbikeModel,
} = require("../app/controllers/ModelController");
const {
  validateTokenAdmin,
  validateTokenAdminAndOwner,
} = require("../app/middleware/validateTokenHandler");

modelRouter.use(bodyParser.json());

modelRouter.route("/cars").get(validateTokenAdminAndOwner, getAllCarModel);

modelRouter
  .route("/motorbikes")
  .get(validateTokenAdminAndOwner, getAllMotorbikeModel);

modelRouter.use(validateTokenAdmin);

modelRouter
  .route("/cars")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })
  .get(getAllCarModel)
  .post(createCarModel)
  .delete(deleteCarModel);

modelRouter
  .route("/motorbikes")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })
  .get(getAllMotorbikeModel)
  .post(createMotorbikeModel)
  .delete(deleteMotorbikeModel);

module.exports = modelRouter;
