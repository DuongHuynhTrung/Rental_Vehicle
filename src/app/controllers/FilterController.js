const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');
const VehicleDetail = require('../models/VehicleDetails');

//@desc Get drivingLicense Of User
//@route GET /vehicleType
//@access private
const getVehicleByVehicleManufacturer = asyncHandler(async (req, res, next) => {
  const manufacturer = req.query.manufacturer;
  const vehicleDetails = await VehicleDetail.find({ manufacturer });
  if (!vehicleDetails) {
    res.status(404);
    throw new Error(
      "Don't have any vehicle with that manufacturer: " + manufacturer
    );
  }
  res.status(200).json(vehicleDetails);
});

const getVehicleByPrice = asyncHandler(async (req, res) => {
  let maxPrice = req.query.maxPrice;
  let minPrice = req.query.minPrice;
  if (isNaN(maxPrice) || isNaN(minPrice)) {
    res.status(400);
    throw new Error('Invalid price range input');
  }
  maxPrice = Number(maxPrice);
  minPrice = Number(minPrice);
  Vehicle.find(
    { price: { $gte: minPrice, $lte: maxPrice } },
    (err, vehicles) => {
      if (err) {
        // Send back an error response
        res.status(500);
        throw new Error('Error in filtering vehicle by price');
      } else {
        // Send back a response with the filtered vehicles
        res.status(200).json(vehicles);
      }
    }
  );
});

const getVehicleByTypes = asyncHandler(async (req, res) => {
  const types = req.query.types.split(',');
  VehicleDetail.find({ vehicleType: { $in: types } }, (err, vehicles) => {
    if (err) {
      res.status(500);
      throw new Error('Error in filtering vehicle by type');
    }
    // If there are no products, send a 404 status
    if (!vehicles || vehicles.length === 0) {
      res.status(404);
      throw new Error('No Vehicle found');
    }
    // If there are products, send them as a JSON response
    res.status(200).json(vehicles);
  });
});

module.exports = {
  getVehicleByVehicleManufacturer,
  getVehicleByPrice,
  getVehicleByTypes,
};
