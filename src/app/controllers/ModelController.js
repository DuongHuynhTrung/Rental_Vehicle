const asyncHandler = require("express-async-handler");
const CarModel = require("../models/Car/CarModel");
const MotorbikeModel = require("../models/Motorbike/MotorbikeModel");
const CarAutoMaker = require("../models/Car/CarAutoMaker");
const MotorbikeAutoMaker = require("../models/Motorbike/MotorbikeAutoMaker");

// Car Aut-Maker
const getAllCarModel = asyncHandler(async (req, res, next) => {
  try {
    const carModels = await CarModel.find().populate("autoMaker_id");
    if (carModels.length === 0) {
      res.status(404);
      throw new Error("Have no Car-Model found");
    }
    res.status(200).json(carModels);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const createCarModel = asyncHandler(async (req, res, next) => {
  try {
    const { carModelParam, autoMaker } = req.body;
    if (!carModelParam || !autoMaker) {
      res.status(404);
      throw new Error("All fields are required");
    }
    const isExist = await CarModel.findOne({ name: carModelParam });
    if (isExist) {
      res.status(400);
      throw new Error("Car-Model has already been exists");
    }
    const carAutoMaker = await CarAutoMaker.findOne({ name: autoMaker });
    if (!carAutoMaker) {
      res.status(404);
      throw new Error("Car-AutoMaker has not been found yet");
    }
    const carModel = await CarModel.create({
      name: carModelParam,
      autoMaker_id: carAutoMaker._id,
    });
    if (!carModel) {
      res.status(500);
      throw new Error("Something went wrong creating the Car-Model");
    }
    res.status(201).json(carModel);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const deleteCarModel = asyncHandler(async (req, res, next) => {
  try {
    const { carModelParam } = req.body;
    if (!carModelParam) {
      res.status(404);
      throw new Error("Car-Model not found");
    }
    const isExist = await CarModel.findOne({ name: carModelParam });
    if (!isExist) {
      res.status(404);
      throw new Error("Car-Model not found");
    }
    const carModel = await CarModel.findOneAndDelete({
      name: carModelParam,
    });
    if (!carModel) {
      res.status(500);
      throw new Error("Something went wrong deleting the Car-Model");
    }
    res.status(201).json(carModel);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

// Motorbike Auto-Maker
const getAllMotorbikeModel = asyncHandler(async (req, res, next) => {
  try {
    const motorbikeModels = await MotorbikeModel.find().populate(
      "autoMaker_id"
    );
    if (motorbikeModels.length === 0) {
      res.status(404);
      throw new Error("Have no Motorbike-Model found");
    }
    res.status(200).json(motorbikeModels);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const createMotorbikeModel = asyncHandler(async (req, res, next) => {
  try {
    const { motorbikeModelParam, autoMaker } = req.body;
    if (!motorbikeModelParam || !autoMaker) {
      res.status(404);
      throw new Error("All fields are required");
    }
    const isExist = await MotorbikeModel.findOne({ name: motorbikeModelParam });
    if (isExist) {
      res.status(400);
      throw new Error("Motorbike-Model has already been exists");
    }
    const motorbikeAutoMaker = await MotorbikeAutoMaker.findOne({
      name: autoMaker,
    });
    if (!motorbikeAutoMaker) {
      res.status(404);
      throw new Error("Motorbike-AutoMaker has not been found yet");
    }
    const motorbikeModel = await MotorbikeModel.create({
      name: motorbikeModelParam,
      autoMaker_id: motorbikeAutoMaker._id,
    });
    if (!motorbikeModel) {
      res.status(500);
      throw new Error("Something went wrong creating the Motorbike-Model");
    }
    res.status(201).json(motorbikeModel);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const deleteMotorbikeModel = asyncHandler(async (req, res, next) => {
  try {
    const { motorbikeModelParam } = req.body;
    if (!motorbikeModelParam) {
      res.status(404);
      throw new Error("Motorbike-Model Param not found");
    }
    const isExist = await MotorbikeModel.findOne({ name: motorbikeModelParam });
    if (!isExist) {
      res.status(404);
      throw new Error("Motorbike-Model not found");
    }
    const motorbikeModel = await MotorbikeModel.findOneAndDelete({
      name: motorbikeModelParam,
    });
    if (!motorbikeModel) {
      res.status(500);
      throw new Error("Something went wrong creating the Motorbike-Model");
    }
    res.status(201).json(motorbikeModel);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

module.exports = {
  getAllCarModel,
  createCarModel,
  deleteCarModel,
  getAllMotorbikeModel,
  createMotorbikeModel,
  deleteMotorbikeModel,
};
