const asyncHandler = require("express-async-handler");
const Vehicle = require("../models/Vehicle");
const XLSX = require("xlsx");
const User = require("../models/User");

//@desc Get all Vehicles Of User
//@route GET /api/vehicles
//@access private
const getVehiclesOfUser = asyncHandler(async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ user_id: req.user.id })
      .populate("user_id")
      .exec();
    if (vehicles.length === 0) {
      res.status(404);
      throw new Error("User don't register any Vehicle!");
    }
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

//@desc Get all Vehicles to Welcome Page
//@route GET /api/vehicles/home
//@access private
const getAllVehicles = asyncHandler(async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().populate("user_id").exec();
    if (vehicles.length === 0) {
      res.status(404);
      throw new Error("Website don't have any Vehicle!");
    }
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

//@desc Get Vehicle
//@route GET /api/Vehicles/:licensePlate
//@access private
const getVehicleByLicensePlate = asyncHandler(async (req, res, next) => {
  try {
    const licensePlate = req.params.licensePlate;
    console.log(licensePlate);
    if (!licensePlate) {
      res.status(404);
      throw new Error(`Invalid licensePlate`);
    }
    const vehicle = await Vehicle.findOne({ licensePlate });
    if (!vehicle) {
      res.status(404);
      throw new Error("Vehicle Not Found!");
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const uploadVehicleFromExcel = async (req, res, next) => {
  const workbook = XLSX.readFile(req.file.path, { sheetStubs: true });
  const sheet_nameList = workbook.SheetNames;
  let x = 0;
  let count = 0;
  let totalVehicle = 0;
  let totalVehicleDetails = 0;
  sheet_nameList.forEach(async () => {
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
                "Something went wrong in create vehicleDetails when loading excel file"
              );
            }
          }
        } else {
          res.status(400);
          throw new Error(
            "Something went wrong with the Excel file. Please check carefully!"
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
  getVehicleByLicensePlate,
};
