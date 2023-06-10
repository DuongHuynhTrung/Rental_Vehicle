const express = require("express");
const bodyParser = require("body-parser");
const categoryRouter = express.Router();

const {
  getAllCarCategory,
  createCarCategory,
  deleteCarCategory,
  getAllMotorbikeCategory,
  createMotorbikeCategory,
  deleteMotorbikeCategory,
} = require("../app/controllers/CategoryController");
const {
  validateTokenAdmin,
} = require("../app/middleware/validateTokenHandler");

categoryRouter.use(bodyParser.json());
categoryRouter.use(validateTokenAdmin);

categoryRouter
  .route("/cars")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })
  .get(getAllCarCategory)
  .post(createCarCategory)
  .delete(deleteCarCategory);

categoryRouter
  .route("/motorbikes")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })
  .get(getAllMotorbikeCategory)
  .post(createMotorbikeCategory)
  .delete(deleteMotorbikeCategory);

module.exports = categoryRouter;
