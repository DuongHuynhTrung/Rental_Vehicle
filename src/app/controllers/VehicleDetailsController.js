const asyncHandler = require('express-async-handler');
const VehicleDetails = require('../models/VehicleDetails');
const Vehicle = require('../models/Vehicle');

//@desc Register New vehicleDetail
//@route POST /api/vehicles/vehicleDetails/:licensePlate
//@access private
const createVehicleDetail = asyncHandler(async (req, res, next) => {
  const {
    vehicleType,
    manufacturer,
    model,
    yearOfManufacturer,
    fuelType,
    transmission,
  } = req.body;
  if (
    !vehicleType ||
    !manufacturer ||
    !model ||
    !yearOfManufacturer ||
    !fuelType ||
    !transmission
  ) {
    res.status(400);
    throw new Error('All field not be empty!');
  }
  const licensePlate = req.params.licensePlate;
  const vehicleDetailsAvailable = await VehicleDetails.findOne({
    licensePlate,
  });
  if (vehicleDetailsAvailable) {
    res.status(400);
    throw new Error("This Vehicle has already have Vehicle's Details!");
  }
  const vehicleDetail = await VehicleDetails.create({
    licensePlate,
    vehicleType,
    manufacturer,
    model,
    yearOfManufacturer,
    fuelType,
    transmission,
  });
  if (vehicleDetail) {
    res.status(201).json(vehicleDetail);
  } else {
    res.status(400);
    throw new Error('Vehicle Details data is not Valid');
  }
});

//@desc Get vehicleDetail
//@route GET /api/vehicles/vehicleDetails/:licensePlate
//@access private
const getVehicleDetailByVehicleID = asyncHandler(async (req, res, next) => {
  const licensePlate = req.params.licensePlate;
  const vehicle = await Vehicle.findOne({ licensePlate });
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle doesn't exist! Please check carefully!");
  }
  const vehicleDetail = await VehicleDetails.findOne({ licensePlate });
  if (!vehicleDetail) {
    res.status(404);
    throw new Error("Vehicle don't have Details. Please add one!");
  }
  res.status(200).json(vehicleDetail);
});

//@desc Update vehicleDetail
//@route PUT /api/vehicleDetails/:licensePlate
//@access private
const updateVehicleDetailsByVehicleID = asyncHandler(async (req, res, next) => {
  const licensePlate = req.params.licensePlate;
  const vehicle = await Vehicle.findOne({ licensePlate });
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle doesn't exist! Please check carefully!");
  }
  const vehicleDetail = await VehicleDetails.findOne({ licensePlate });
  if (!vehicleDetail) {
    res.status(404);
    throw new Error("Vehicle don't have Details. Please add one!");
  }
  const {
    vehicleType,
    manufacturer,
    model,
    yearOfManufacturer,
    fuelType,
    transmission,
  } = req.body;
  if (
    !vehicleType ||
    !manufacturer ||
    !model ||
    !yearOfManufacturer ||
    !fuelType ||
    !transmission
  ) {
    res.status(400);
    throw new Error('All field not be empty!');
  }
  const vehicleDetails_id = vehicleDetail._id.toString();
  const updateVehicleDetail = await VehicleDetails.findByIdAndUpdate(
    vehicleDetails_id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updateVehicleDetail);
});

//@desc Delete vehicleDetail
//@route DELETE /api/vehicleDetails/:licensePlate
//@access private
const deleteVehicleDetailsByVehicleID = asyncHandler(async (req, res, next) => {
  const licensePlate = req.params.licensePlate;
  const vehicle = await Vehicle.findOne({ licensePlate });
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle doesn't exist! Please check carefully!");
  }
  const vehicleDetail = await VehicleDetails.findOne({ licensePlate });
  if (!vehicleDetail) {
    res.status(404);
    throw new Error("Vehicle don't have Details. Please add one!");
  }
  await VehicleDetails.deleteOne({ _id: vehicleDetail._id });
  res.status(200).json(vehicleDetail);
});

module.exports = {
  createVehicleDetail,
  getVehicleDetailByVehicleID,
  updateVehicleDetailsByVehicleID,
  deleteVehicleDetailsByVehicleID,
};
