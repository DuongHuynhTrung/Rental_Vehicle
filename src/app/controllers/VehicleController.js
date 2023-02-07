const asyncHandler = require("express-async-handler");
const Vehicle = require("../modules/Vehicle");

//@desc Get all Vehicles
//@route GET /api/vehicles
//@access private
const getVehicles = asyncHandler(async (req, res, next) => {
  const vehicles = await Vehicle.find({ user_id: req.user.id });
  res.status(200).json(vehicles);
});

//@desc Register New Vehicle
//@route POST /api/Vehicles/register
//@access private
const registerVehicle = asyncHandler(async (req, res, next) => {
  const { licensePlates, description, insurance } = req.body;
  if (!licensePlates || !description || !insurance) {
    res.status(400);
    throw new Error("All field not be empty!");
  }
  const vehicleAvailable = await Vehicle.findOne({ licensePlates });
  if (vehicleAvailable) {
    res.status(400);
    throw new Error("Vehicle has already registered!");
  }
  const vehicle = Vehicle.create({
    user_id: req.user.id,
    licensePlates,
    description,
    insurance,
  });
  if (vehicle) {
    res.status(201).json({ _id: vehicle.id, user_id: vehicle.user_id });
  } else {
    res.status(400);
    throw new Error("Vehicle data is not Valid");
  }
});

//@desc Get Vehicle
//@route GET /api/Vehicles/:id
//@access private
const getVehicleById = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle Not Found!");
  }
  res.status(200).json(vehicle);
});

//@desc Update Vehicle
//@route PUT /api/Vehicles/:id
//@access private
const updateVehicles = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle Not Found!");
  }
  if (vehicle.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other vehicle!");
  }
  const { licensePlates } = req.body;
  const vehicleAvailable = await Vehicle.findOne({ licensePlates });
  if (vehicleAvailable) {
    res.status(400);
    throw new Error("This vehicle's License has already Exist!");
  }
  const updateVehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updateVehicle);
});

//@desc Delete Vehicle
//@route DELETE /api/Vehicles/:id
//@access private
const deleteVehicles = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle Not Found!");
  }
  if (vehicle.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other vehicle!");
  }
  await Vehicle.deleteOne({ _id: req.params.id });
  res.status(200).json(vehicle);
});

module.exports = {
  getVehicles,
  registerVehicle,
  getVehicleById,
  updateVehicles,
  deleteVehicles,
};
