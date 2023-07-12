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

autoMakerRouter.route("/cars").get(validateToken, getAllCarAutoMaker);

autoMakerRouter
  .route("/motorbikes")
  .get(validateToken, getAllMotorbikeAutoMaker);

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
  .get(getAllMotorbikeAutoMaker)
  .post(createMotorbikeAutoMaker)
  .delete(deleteMotorbikeAutoMaker);

module.exports = autoMakerRouter;
