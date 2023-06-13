const asyncHandler = require("express-async-handler");
const Car = require("../models/Car/Car");
const XLSX = require("xlsx");
const User = require("../models/User");
const CarAutoMaker = require("../models/Car/CarAutoMaker");
const CarModel = require("../models/Car/CarModel");
const CarCategory = require("../models/Car/CarCategory");
const Vehicle = require("../models/Vehicle");
const { default: mongoose } = require("mongoose");

//@desc Get all Cars Of User
//@route GET /api/cars
//@access private
const getCarsOfUser = asyncHandler(async (req, res, next) => {
  try {
    const cars = await Car.find()
      .populate({
        path: "vehicle_id",
        populate: {
          path: "user_id",
          model: "User",
        },
      })
      .populate("autoMaker_id")
      .populate("model_id")
      .populate("category_id")
      .exec();
    const items = cars.filter(
      (car) => car.vehicle_id.user_id._id.toString() === req.user.id
    );
    if (!items) {
      res.status(500);
      throw new Error("Something went wrong when fetching cars of user");
    }
    if (items.length === 0) {
      res.status(404);
      throw new Error("User don't register any Car!");
    }
    res.status(200).json(items);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

//@desc Get all Cars to Welcome Page
//@route GET /api/cars/home
//@access private
const getAllCars = asyncHandler(async (req, res, next) => {
  try {
    const cars = await Car.find()
      .populate({
        path: "vehicle_id",
        populate: {
          path: "user_id",
          model: "User",
        },
      })
      .populate("autoMaker_id")
      .populate("model_id")
      .populate("category_id")
      .exec();
    if (!cars) {
      res.status(500);
      throw new Error("Something went wrong when getting all cars");
    }
    if (cars.length === 0) {
      res.status(404);
      throw new Error("Website don't have any Car!");
    }
    res.status(200).json(cars);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

//@desc Register New Car
//@route POST /api/cars
//@access private
const registerCar = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      licensePlate,
      description,
      autoMaker,
      model,
      insurance,
      fuel,
      category,
      transmission,
      yearOfManufacturer,
      price,
      mortgage,
      otherFacilities,
      images,
    } = req.body;
    if (
      licensePlate === undefined ||
      description === undefined ||
      autoMaker === undefined ||
      model === undefined ||
      insurance === undefined ||
      fuel === undefined ||
      category === undefined ||
      transmission === undefined ||
      yearOfManufacturer === undefined ||
      price === undefined ||
      otherFacilities === undefined ||
      images === undefined ||
      mortgage === undefined
    ) {
      res.status(400);
      throw new Error("All field not be empty!");
    }
    const cars = await Car.find().populate("vehicle_id", "licensePlate");
    const isCarExist = cars.find(
      (car) => car.vehicle_id.licensePlate === licensePlate
    );
    if (isCarExist) {
      res.status(400);
      throw new Error("Car has already registered with License Plates!");
    }
    const carAutoMaker = await CarAutoMaker.findOne({ name: autoMaker });
    if (!carAutoMaker) {
      res.status(404);
      throw new Error("AutoMaker Not Found");
    }
    const carModel = await CarModel.findOne({ name: model });
    if (!carModel) {
      res.status(404);
      throw new Error("Model Not Found");
    }
    const carCategory = await CarCategory.findOne({ name: category });
    if (!carCategory) {
      res.status(404);
      throw new Error("Category Not Found");
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User Not Found");
    }
    const vehicle = await Vehicle.create({
      name: carModel.name + " " + yearOfManufacturer,
      user_id: user._id.toString(),
      licensePlate,
      description,
      price,
      location: user.address,
      yearOfManufacturer,
      insurance,
      images,
      mortgage,
    });
    if (!vehicle) {
      res.status(500);
      throw new Error(
        "Something went wrong creating vehicle in create car function"
      );
    }
    const car = await Car.create({
      vehicle_id: vehicle._id.toString(),
      autoMaker_id: carAutoMaker._id.toString(),
      model_id: carModel._id.toString(),
      fuel,
      category_id: carCategory._id.toString(),
      transmission,
      otherFacilities,
    });
    if (!car) {
      res.status(500);
      throw new Error("Something went wrong creating the Car");
    }
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(car);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get Car
//@route GET /api/cars/:licensePlate
//@access private
const getCarByLicensePlate = asyncHandler(async (req, res, next) => {
  try {
    const licensePlate = req.params.licensePlate;
    if (!licensePlate) {
      res.status(404);
      throw new Error("Invalid licensePlate");
    }
    const vehicle = await Vehicle.findOne({ licensePlate });
    if (!vehicle) {
      res.status(404);
      throw new Error("Vehicle not found");
    }
    const car = await Car.findOne({ vehicle_id: vehicle._id })
      .populate({
        path: "vehicle_id",
        populate: {
          path: "user_id",
          model: "User",
        },
      })
      .populate("autoMaker_id")
      .populate("model_id")
      .populate("category_id")
      .exec();
    if (!car) {
      res.status(404);
      throw new Error("Car Not Found!");
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

//@desc Update Car
//@route PUT /api/Cars/:id
//@access private
const updateCars = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const licensePlateParam = req.params.licensePlate;
    const {
      licensePlate,
      description,
      autoMaker,
      model,
      insurance,
      fuel,
      category,
      transmission,
      yearOfManufacturer,
      price,
      mortgage,
      otherFacilities,
      images,
    } = req.body;
    if (
      licensePlate === undefined ||
      description === undefined ||
      autoMaker === undefined ||
      model === undefined ||
      insurance === undefined ||
      fuel === undefined ||
      category === undefined ||
      transmission === undefined ||
      yearOfManufacturer === undefined ||
      price === undefined ||
      otherFacilities === undefined ||
      images === undefined ||
      mortgage === undefined
    ) {
      res.status(400);
      throw new Error("All field not be empty!");
    }
    // check for required
    const carAutoMaker = await CarAutoMaker.findOne({ name: autoMaker });
    if (!carAutoMaker) {
      res.status(404);
      throw new Error("AutoMaker Not Found");
    }
    const carModel = await CarModel.findOne({ name: model });
    if (!carModel) {
      res.status(404);
      throw new Error("Model Not Found");
    }
    const carCategory = await CarCategory.findOne({ name: category });
    if (!carCategory) {
      res.status(404);
      throw new Error("Category Not Found");
    }
    const vehicle = await Vehicle.findOne({ licensePlate: licensePlateParam });
    if (!vehicle) {
      res.status(404);
      throw new Error("Vehicle not found");
    }
    const car = await Car.findOne({ vehicle_id: vehicle._id });
    if (!car) {
      res.status(404);
      throw new Error("Car Not Found!");
    }
    const userId = vehicle.user_id.toString();
    if (userId !== req.user.id) {
      res.status(403);
      throw new Error("You don't have permission to update Car's information!");
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User Not Found");
    }
    const updateVehicle = await Vehicle.findByIdAndUpdate(
      vehicle._id,
      {
        name: carModel.name + " " + yearOfManufacturer,
        licensePlate,
        description,
        price,
        location: user.address,
        yearOfManufacturer,
        insurance,
        images,
        mortgage,
      },
      {
        new: true,
      }
    );
    if (!updateVehicle) {
      res.status(500);
      throw new Error("Something went wrong updating vehicle in updateCar");
    }
    const updateCar = await Car.findByIdAndUpdate(
      car._id.toString(),
      {
        autoMaker_id: carAutoMaker._id.toString(),
        model_id: carModel._id.toString(),
        fuel,
        category_id: carCategory._id.toString(),
        transmission,
        otherFacilities,
      },
      {
        new: true,
      }
    );
    if (!updateCar) {
      res.status(500);
      throw new Error("Something went wrong updating Car");
    }
    //commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json(updateCar);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(res.statusCode || 500).send(error.message);
  }
});

//@desc Delete Car
//@route DELETE /api/Cars/:id
//@access private
const deleteCars = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const licensePlate = req.params.licensePlate;
    if (!licensePlate) {
      res.status(404);
      throw new Error("Invalid license");
    }
    const vehicle = await Vehicle.findOne({ licensePlate });
    if (!vehicle) {
      res.status(404);
      throw new Error("Vehicle not found");
    }
    const car = await Car.findOne({ vehicle_id: vehicle._id });
    if (!car) {
      res.status(404);
      throw new Error("Car Not Found!");
    }
    const userId = vehicle.user_id.toString();
    if (userId !== req.user.id) {
      res.status(403);
      throw new Error("You don't have permission to update other Car!");
    }
    const deleteCar = await Car.findByIdAndDelete(car._id);
    if (!deleteCar) {
      res.status(500);
      throw new Error("Something went wrong deleting the car!");
    }
    const deleteVehicle = await Vehicle.findByIdAndDelete(vehicle._id);
    if (!deleteVehicle) {
      res.status(500);
      throw new Error(
        "Something went wrong deleting the vehicle! in deleteCar"
      );
    }
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json(deleteCar);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(res.statusCode || 500).send(error.message);
  }
});

const uploadCarFromExcel = async (req, res, next) => {
  try {
    const workbook = XLSX.readFile(req.file.path, { sheetStubs: true });
    const sheet_nameList = workbook.SheetNames;
    let x = 0;
    sheet_nameList.forEach(async () => {
      const xlData = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_nameList[x]]
      );
      xlData.forEach(async (item) => {
        try {
          const session = await mongoose.startSession();
          session.startTransaction();

          // data from excel file
          const licensePlate = item.licensePlate;
          const description = item.description;
          const insurance = item.insurance;
          const price = item.price;
          const images = item.images;
          const category = item.category;
          const autoMaker = item.autoMaker;
          const model = item.model;
          const yearOfManufacturer = item.yearOfManufacturer;
          const fuel = item.fuel;
          const transmission = item.transmission;
          const mortgage = item.mortgage;
          const otherFacilities = item.otherFacilities;

          if (
            licensePlate !== undefined &&
            description !== undefined &&
            autoMaker !== undefined &&
            model !== undefined &&
            insurance !== undefined &&
            fuel !== undefined &&
            category !== undefined &&
            transmission !== undefined &&
            yearOfManufacturer !== undefined &&
            price !== undefined &&
            otherFacilities !== undefined &&
            images !== undefined &&
            mortgage !== undefined
          ) {
            const isDuplicate = await Vehicle.findOne({
              licensePlate,
            });
            if (!isDuplicate) {
              const carAutoMaker = await CarAutoMaker.findOne({
                name: autoMaker,
              });
              if (!carAutoMaker) {
                res.status(404);
                throw new Error("AutoMaker Not Found");
              }
              const carModel = await CarModel.findOne({ name: model });
              if (!carModel) {
                res.status(404);
                throw new Error("Model Not Found");
              }
              const carCategory = await CarCategory.findOne({ name: category });
              if (!carCategory) {
                res.status(404);
                throw new Error("Category Not Found");
              }
              const user = await User.findById(req.user.id);
              if (!user) {
                res.status(404);
                throw new Error("User Not Found");
              }
              //create a new vehicle
              const vehicle = await Vehicle.create({
                name: carModel.name + yearOfManufacturer,
                user_id: user._id.toString(),
                licensePlate,
                description,
                price,
                location: user.address,
                yearOfManufacturer,
                insurance,
                images,
                mortgage,
              });
              if (!vehicle) {
                res.status(500);
                throw new Error(
                  "Something went wrong with the Excel file. Please check carefully!"
                );
              }

              //create a new car
              const car = await Car.create({
                vehicle_id: vehicle._id.toString(),
                autoMaker_id: carAutoMaker._id.toString(),
                model_id: carModel._id.toString(),
                fuel,
                category_id: carCategory._id.toString(),
                transmission,
                otherFacilities,
              });
              if (!car) {
                res.status(500);
                throw new Error(
                  "Something went wrong with the Excel file. Please check carefully!"
                );
              }
            }
          }
          // Commit the transaction
          await session.commitTransaction();
          session.endSession();
        } catch (error) {
          await session.abortTransaction();
          session.endSession();

          next(error);
        }
      });
      x++;
    });
    res.status(201).json({
      message: `Successfully loaded excel file! Total Cars: ${x}`,
    });
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
};

module.exports = {
  getCarsOfUser,
  getAllCars,
  registerCar,
  getCarByLicensePlate,
  updateCars,
  deleteCars,
  uploadCarFromExcel,
};
