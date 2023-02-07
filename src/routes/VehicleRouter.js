const express = require("express");
const bodyParser = require("body-parser");
const vehicleRouter = express.Router();
const {
  getVehicles,
  registerVehicle,
  getVehicleById,
  updateVehicles,
  deleteVehicles,
} = require("../app/controllers/VehicleController");
const validateToken = require("../app/middleware/validateTokenHandler");

vehicleRouter.use(bodyParser.json());
vehicleRouter.use(validateToken);
vehicleRouter
  .route("/")
  //   .all((req, res, next) => {
  //     res.statusCode = 200;
  //     res.setHeader("Content-Type", "json/plain");
  //     next();
  //   })
  .get(getVehicles)
  .post(registerVehicle);

vehicleRouter
  .route("/:id")
  //   .all((req, res, next) => {
  //     res.statusCode = 200;
  //     res.setHeader("Content-Type", "json/plain");
  //     next();
  //   })
  .get(getVehicleById)
  .put(updateVehicles)
  .delete(deleteVehicles);

module.exports = vehicleRouter;
