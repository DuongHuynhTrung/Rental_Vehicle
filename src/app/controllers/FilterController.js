const asyncHandler = require("express-async-handler");
const Car = require("../models/Car/Car");
const Motorbike = require("../models/Motorbike/Motorbike");
const Booking = require("../models/Booking");

//@desc Get drivingLicense Of User
//@route GET /vehicleType
//@access private
const getVehiclesHaveInsurance = asyncHandler(async (req, res, next) => {
  const vehicleType = req.query.vehicleType;
  if (!vehicleType) {
    res.status(400).send("Vehicle type is required");
  }
  if (vehicleType !== "Motorbike" && vehicleType !== "Car") {
    res.status(400).send("Vehicle type Invalid");
  }
  if (vehicleType === "Car") {
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
      const carsHaveInsurance = cars.filter(
        (car) => car.vehicle_id.insurance === true
      );
      if (carsHaveInsurance.length <= 0) {
        res.status(404);
        throw new Error(`Don't have any cars have insurance`);
      }
      res.status(200).json(carsHaveInsurance);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  } else {
    try {
      const motorbikes = await Motorbike.find()
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
      const motorbikesHaveInsurance = motorbikes.filter(
        (motorbike) => motorbike.vehicle_id.insurance === true
      );
      if (motorbikesHaveInsurance.length <= 0) {
        res.status(404);
        throw new Error(`Don't have any motorbikes have insurance`);
      }
      res.status(200).json(motorbikesHaveInsurance);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  }
});

const getVehiclesNoMortgage = asyncHandler(async (req, res, next) => {
  const vehicleType = req.query.vehicleType;
  if (!vehicleType) {
    res.status(400).send("Vehicle type is required");
  }
  if (vehicleType !== "Motorbike" && vehicleType !== "Car") {
    res.status(400).send("Vehicle type Invalid");
  }
  if (vehicleType === "Car") {
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
      const carsNoMortgage = cars.filter(
        (car) => car.vehicle_id.mortgage === false
      );
      if (carsNoMortgage.length <= 0) {
        res.status(404);
        throw new Error(`Don't have any cars have no mortgage`);
      }
      res.status(200).json(carsNoMortgage);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  } else {
    try {
      const motorbikes = await Motorbike.find()
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
      const motorbikesNoMortgage = motorbikes.filter(
        (motorbike) => motorbike.vehicle_id.mortgage === false
      );
      if (motorbikesNoMortgage.length <= 0) {
        res.status(404);
        throw new Error(`Don't have any motorbikes have no mortgage`);
      }
      res.status(200).json(motorbikesNoMortgage);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  }
});

const getVehiclesByPrice = asyncHandler(async (req, res) => {
  const vehicleType = req.query.vehicleType;
  if (!vehicleType) {
    res.status(400).send("Vehicle type is required");
  }
  if (vehicleType !== "Motorbike" && vehicleType !== "Car") {
    res.status(400).send("Vehicle type Invalid");
  }
  let maxPrice = req.query.maxPrice;
  let minPrice = req.query.minPrice;
  if (isNaN(maxPrice) || isNaN(minPrice)) {
    res.status(400);
    throw new Error("Invalid price range input");
  }
  maxPrice = Number(maxPrice);
  minPrice = Number(minPrice);
  if (maxPrice < minPrice) {
    res.status(400);
    throw new Error("Invalid price range input");
  }
  if (vehicleType === "Car") {
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
      const carsInRange = cars.filter(
        (car) =>
          car.vehicle_id.price >= minPrice && car.vehicle_id.price <= maxPrice
      );
      if (carsInRange.length <= 0) {
        res.status(404);
        throw new Error(`Have no cars in range ${minPrice} to ${maxPrice}`);
      }
      res.status(200).json(carsInRange);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  } else {
    try {
      const motorbikes = await Motorbike.find()
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
      const motorbikesInRange = motorbikes.filter(
        (motorbike) =>
          motorbike.vehicle_id.price >= minPrice &&
          motorbike.vehicle_id.price <= maxPrice
      );
      if (motorbikesInRange.length <= 0) {
        res.status(404);
        throw new Error(
          `Have no motorbikes in range ${minPrice} to ${maxPrice}`
        );
      }
      res.status(200).json(motorbikesInRange);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  }
});

const getVehicleByCategory = asyncHandler(async (req, res) => {
  const vehicleType = req.query.vehicleType;
  if (!vehicleType) {
    res.status(400).send("Vehicle type is required");
  }
  if (vehicleType !== "Motorbike" && vehicleType !== "Car") {
    res.status(400).send("Vehicle type Invalid");
  }
  if (vehicleType === "Car") {
    try {
      const category = req.query.category;
      if (!category) {
        res.status(400);
        throw new Error("Category is required");
      }
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
      const carsHaveCategory = cars.filter(
        (car) => car.category_id.name === category
      );
      if (carsHaveCategory.length <= 0) {
        res.status(404);
        throw new Error(`Have no Car with category: ${category}`);
      }
      res.status(200).json(carsHaveCategory);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  } else {
    try {
      const category = req.query.category;
      if (!category) {
        res.status(400);
        throw new Error("Category is required");
      }
      const motorbikes = await Motorbike.find()
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
      const motorbikesHaveCategory = motorbikes.filter(
        (motorbike) => motorbike.category_id.name === category
      );
      if (motorbikesHaveCategory.length <= 0) {
        res.status(404);
        throw new Error(`Have no Motorbike with category: ${category}`);
      }
      res.status(200).json(motorbikesHaveCategory);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  }
});

const getVehicleByAutoMaker = asyncHandler(async (req, res) => {
  const vehicleType = req.query.vehicleType;
  if (!vehicleType) {
    res.status(400).send("Vehicle type is required");
  }
  if (vehicleType !== "Motorbike" && vehicleType !== "Car") {
    res.status(400).send("Vehicle type Invalid");
  }
  if (vehicleType === "Car") {
    try {
      const autoMaker = req.query.autoMaker;
      if (!autoMaker) {
        res.status(400);
        throw new Error("AutoMaker is required");
      }
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
      const carsWithAutoMaker = cars.filter(
        (car) => car.autoMaker_id.name === autoMaker
      );
      if (carsWithAutoMaker.length <= 0) {
        res.status(404);
        throw new Error(`Have no Car with autoMaker: ${autoMaker}`);
      }
      res.status(200).json(carsWithAutoMaker);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  } else {
    try {
      const autoMaker = req.query.autoMaker;
      if (!autoMaker) {
        res.status(400);
        throw new Error("AutoMaker is required");
      }
      const motorbikes = await Motorbike.find()
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
      const motorbikesWithAutoMaker = motorbikes.filter(
        (motorbike) => motorbike.autoMaker_id.name === autoMaker
      );
      if (motorbikesWithAutoMaker.length <= 0) {
        res.status(404);
        throw new Error(`Have no Motorbike with autoMaker: ${autoMaker}`);
      }
      res.status(200).json(motorbikesWithAutoMaker);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  }
});

const getVehicleByModel = asyncHandler(async (req, res) => {
  const vehicleType = req.query.vehicleType;
  if (!vehicleType) {
    res.status(400).send("Vehicle type is required");
  }
  if (vehicleType !== "Motorbike" && vehicleType !== "Car") {
    res.status(400).send("Vehicle type Invalid");
  }
  if (vehicleType === "Car") {
    try {
      const model = req.query.model;
      if (!model) {
        res.status(400);
        throw new Error("Model is required");
      }
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
      const carsWithModel = cars.filter((car) => car.model_id.name === model);
      if (carsWithModel.length <= 0) {
        res.status(404);
        throw new Error(`Have no Car with model: ${model}`);
      }
      res.status(200).json(carsWithModel);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  } else {
    try {
      const model = req.query.model;
      if (!model) {
        res.status(400);
        throw new Error("Model is required");
      }
      const motorbikes = await Motorbike.find()
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
      const motorbikesWithModel = motorbikes.filter(
        (motorbike) => motorbike.model_id.name === model
      );
      if (motorbikesWithModel.length <= 0) {
        res.status(404);
        throw new Error(`Have no Motorbike with model: ${model}`);
      }
      res.status(200).json(motorbikesWithModel);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  }
});

const getVehicleByAddress = asyncHandler(async (req, res) => {
  const vehicleType = req.query.vehicleType;
  if (!vehicleType) {
    res.status(400).send("Vehicle type is required");
  }
  if (vehicleType !== "Motorbike" && vehicleType !== "Car") {
    res.status(400).send("Vehicle type Invalid");
  }
  if (vehicleType === "Car") {
    try {
      const address = req.query.address;
      if (!address) {
        res.status(400);
        throw new Error("Address is required");
      }
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
      const carsWithAddress = cars.filter(
        (car) => car.vehicle_id.location === address
      );
      if (carsWithAddress.length <= 0) {
        res.status(404);
        throw new Error(`Have no Car with Address: ${address}`);
      }
      res.status(200).json(carsWithAddress);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  } else {
    try {
      const address = req.query.address;
      if (!address) {
        res.status(400);
        throw new Error("Address is required");
      }
      const motorbikes = await Motorbike.find()
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
      const motorbikesWithAddress = motorbikes.filter(
        (motorbike) => motorbike.vehicle_id.location === address
      );
      if (motorbikesWithAddress.length <= 0) {
        res.status(404);
        throw new Error(`Have no motorbike with Address: ${address}`);
      }
      res.status(200).json(motorbikesWithAddress);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  }
});

const getVehicleByFuel = asyncHandler(async (req, res) => {
  const vehicleType = req.query.vehicleType;
  if (!vehicleType) {
    res.status(400).send("Vehicle type is required");
  }
  if (vehicleType !== "Motorbike" && vehicleType !== "Car") {
    res.status(400).send("Vehicle type Invalid");
  }
  if (vehicleType === "Car") {
    try {
      const fuel = req.query.fuel;
      if (!fuel) {
        res.status(400);
        throw new Error("Fuel is required");
      }
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
      const carsWithFuel = cars.filter((car) => car.fuel === fuel);
      if (carsWithFuel.length <= 0) {
        res.status(404);
        throw new Error(`Have no Car with Fuel: ${fuel}`);
      }
      res.status(200).json(carsWithFuel);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  } else {
    try {
      const fuel = req.query.fuel;
      if (!fuel) {
        res.status(400);
        throw new Error("Fuel is required");
      }
      const motorbikes = await Motorbike.find()
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
      const motorbikesWithFuel = motorbikes.filter(
        (motorbike) => motorbike.fuel === fuel
      );
      if (motorbikesWithFuel.length <= 0) {
        res.status(404);
        throw new Error(`Have no Motorbike with Fuel: ${fuel}`);
      }
      res.status(200).json(motorbikesWithFuel);
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  }
});

const getCarsByTransmission = asyncHandler(async (req, res) => {
  try {
    const transmission = req.query.transmission;
    if (!transmission) {
      res.status(400);
      throw new Error("Transmission is required");
    }
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
    const carsWithTransmission = cars.filter(
      (car) => car.transmission === transmission
    );
    if (carsWithTransmission.length <= 0) {
      res.status(404);
      throw new Error(`Have no Car with transmission: ${transmission}`);
    }
    res.status(200).json(carsWithTransmission);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const getVehicleByDate = asyncHandler(async (req, res) => {
  const vehicleType = req.query.vehicleType;
  if (!vehicleType) {
    res.status(400).send("Vehicle type is required");
  }
  if (vehicleType !== "Motorbike" && vehicleType !== "Car") {
    res.status(400).send("Vehicle type Invalid");
  }
  if (vehicleType === "Car") {
    try {
      let { startDate, endDate } = req.body;
      startDate = moment(startDate);
      endDate = moment(endDate);
      let bookings = Booking.find()
        .populate("user_id")
        .populate("vehicle_id")
        .populate("user_canceled")
        .populate("voucher_id")
        .exec();
      bookings = bookings.filter(
        (booking) =>
          booking.bookingStatus === "Pending" ||
          booking.bookingStatus === "Processing" ||
          booking.bookingStatus === "Paying" ||
          booking.bookingStatus === "Delivering"
      );
      return bookings;
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  } else {
    try {
    } catch (error) {
      res.status(res.statusCode || 500).send(error.message);
    }
  }
});

module.exports = {
  getVehiclesHaveInsurance,
  getVehiclesNoMortgage,
  getVehiclesByPrice,
  getVehicleByCategory,
  getVehicleByAutoMaker,
  getVehicleByModel,
  getCarsByTransmission,
  getVehicleByAddress,
  getVehicleByFuel,
};
