const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');
const VehicleDetails = require('../models/VehicleDetails');
const XLSX = require('xlsx');
const User = require('../models/User');

//@desc Get all Vehicles Of User
//@route GET /api/vehicles
//@access private
const getVehiclesOfUser = asyncHandler(async (req, res, next) => {
  const vehicles = await Vehicle.find({ user_id: req.user.id });
  if (vehicles.length === 0) {
    res.status(404);
    throw new Error("User don't register any Vehicle!");
  }
  res.status(200).json(vehicles);
});

//@desc Get all Vehicles to Welcome Page
//@route GET /api/vehicles/home
//@access private
const getAllVehicles = asyncHandler(async (req, res, next) => {
  const vehicles = await Vehicle.find().populate('user_id').exec();
  if (vehicles.length === 0) {
    res.status(404);
    throw new Error("Website don't have any Vehicle!");
  }
  res.status(200).json(vehicles);
});

//@desc Register New Vehicle
//@route POST /api/Vehicles
//@access private
const registerVehicle = asyncHandler(async (req, res, next) => {
  const { licensePlate, description, insurance, price, isRented } = req.body;
  let { image } = req.body;
  if (
    !licensePlate ||
    !description ||
    !insurance ||
    !price ||
    isRented == null
  ) {
    res.status(400);
    throw new Error('All field not be empty!');
  }
  const vehicleAvailable = await Vehicle.findOne({ licensePlate });
  if (vehicleAvailable) {
    res.status(400);
    throw new Error('Vehicle has already registered with License Plates!');
  }
  if (image === undefined) {
    image = '';
  }
  const vehicle = await Vehicle.create({
    user_id: req.user.id,
    licensePlate,
    description,
    insurance,
    price,
    image,
    isRented,
  });
  if (vehicle) {
    res.status(201).json(vehicle);
  } else {
    res.status(400);
    throw new Error('Vehicle data is not Valid');
  }
});

//@desc Get Vehicle
//@route GET /api/Vehicles/:id
//@access private
const getVehicleById = asyncHandler(async (req, res, next) => {
  const licensePlate = req.params.licensePlate;
  const vehicle = await Vehicle.findOne({ licensePlate });
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle Not Found!');
  }
  res.status(200).json(vehicle);
});

//@desc Update Vehicle
//@route PUT /api/Vehicles/:id
//@access private
const updateVehicles = asyncHandler(async (req, res, next) => {
  const licensePlate = req.params.licensePlate;
  const vehicle = await Vehicle.findOne({ licensePlate });
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle Not Found!');
  }
  const { description, insurance, image, price } = req.body;
  if (!description || !insurance || image || price) {
    res.status(400);
    throw new Error('All field not be empty!');
  }
  const userId = vehicle.user_id.toString();
  if (userId !== req.user.id) {
    res.status(403);
    throw new Error(
      "You don't have permission to update vehicle's information!"
    );
  }
  const updateVehicle = await Vehicle.findByIdAndUpdate(
    vehicle._id.toString(),
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
  const licensePlate = req.params.licensePlate;
  const vehicle = await Vehicle.findOne({ licensePlate });
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle Not Found!');
  }
  const userId = vehicle.user_id.toString();
  if (userId !== req.user.id) {
    res.status(403);
    throw new Error("You don't have permission to update other vehicle!");
  }
  await Vehicle.deleteOne({ _id: vehicle._id });
  res.status(200).json(vehicle);
});

const uploadVehicleFromExcel = async (req, res, next) => {
  const workbook = XLSX.readFile(req.file.path, { sheetStubs: true });
  const sheet_nameList = workbook.SheetNames;
  let x = 0;
  let count = 0;
  let totalVehicle = 0;
  let totalVehicleDetails = 0;
  sheet_nameList.forEach(async (element) => {
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_nameList[x]]);
    xlData.forEach(async (item) => {
      count++;
      // data from excel file
      const licensePlate = item.licensePlate;
      const description = item.description;
      const insurance = item.insurance;
      const price = item.price;
      const image = item.image;
      const vehicleType = item.vehicleType;
      const manufacturer = item.manufacturer;
      const model = item.model;
      const yearOfManufacturer = item.yearOfManufacturer;
      const fuelType = item.fuelType;
      const transmission = item.transmission;

      const isDuplicate = await Vehicle.findOne({
        licensePlate,
      });
      if (
        !isDuplicate &&
        insurance !== undefined &&
        price !== undefined &&
        image !== undefined
      ) {
        const vehicle = await Vehicle.create({
          user_id: req.user.id,
          licensePlate,
          description,
          insurance,
          price,
          image,
          isRented: false,
        });
        if (vehicle) {
          totalVehicle++;
          const isDuplicate = await VehicleDetails.findOne({
            licensePlate,
          });
          if (
            !isDuplicate &&
            vehicleType !== undefined &&
            manufacturer !== undefined &&
            model !== undefined &&
            yearOfManufacturer !== undefined &&
            fuelType !== undefined &&
            transmission !== undefined
          ) {
            totalVehicleDetails++;
            const vehicleDetail = await VehicleDetails.create({
              licensePlate,
              vehicleType,
              manufacturer,
              model,
              yearOfManufacturer,
              fuelType,
              transmission,
            });
            if (!vehicleDetail) {
              res.status(400);
              throw new Error(
                'Something went wrong in create vehicleDetails when loading excel file'
              );
            }
          }
        } else {
          res.status(400);
          throw new Error(
            'Something went wrong with the Excel file. Please check carefully!'
          );
        }
      }
    });
    x++;
  });
  res.status(201).json({
    message: `Successfully loaded excel file! Total Vehicles: ${totalVehicle}, Total Vehicle Details: ${totalVehicleDetails}`,
  });
};

module.exports = {
  getVehiclesOfUser,
  getAllVehicles,
  registerVehicle,
  getVehicleById,
  updateVehicles,
  deleteVehicles,
  uploadVehicleFromExcel,
};
