const asyncHandler = require("express-async-handler");
const CarAutoMaker = require("../models/Car/CarAutoMaker");
const MotorbikeAutoMaker = require("../models/Motorbike/MotorbikeAutoMaker");

// Car Aut-Maker
const getAllCarAutoMaker = asyncHandler(async (req, res, next) => {
  try {
    const carAutoMakers = await CarAutoMaker.find();
    if (carAutoMakers.length === 0) {
      res.status(404);
      throw new Error("Have no Car-AutoMaker found");
    }
    res.status(200).json(carAutoMakers);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const createCarAutoMaker = asyncHandler(async (req, res, next) => {
  try {
    const carAutoMakerParam = req.body.autoMaker;
    if (!carAutoMakerParam) {
      res.status(404);
      throw new Error("AutoMaker is required");
    }
    const isExist = await CarAutoMaker.findOne({ name: carAutoMakerParam });
    if (isExist) {
      res.status(400);
      throw new Error("Car-AutoMaker has already been exists");
    }
    const carAutoMaker = await CarAutoMaker.create({ name: carAutoMakerParam });
    if (!carAutoMaker) {
      res.status(500);
      throw new Error("Something went wrong creating the Car-AutoMaker");
    }
    res.status(201).json(carAutoMaker);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const deleteCarAutoMaker = asyncHandler(async (req, res, next) => {
  try {
    const carAutoMakerParam = req.body.autoMaker;
    if (!carAutoMakerParam) {
      res.status(404);
      throw new Error("Auto-Maker not found");
    }
    const isExist = await CarAutoMaker.findOne({ name: carAutoMakerParam });

    if (!isExist) {
      res.status(404);
      throw new Error("Car-AutoMaker not found");
    }
    const carAutoMaker = await CarAutoMaker.findOneAndDelete({
      name: carAutoMakerParam,
    });
    if (!carAutoMaker) {
      res.status(500);
      throw new Error("Something went wrong creating the Car-AutoMaker");
    }
    res.status(201).json(carAutoMaker);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

// Motorbike Auto-Maker
const getAllMotorbikeAutoMaker = asyncHandler(async (req, res, next) => {
  try {
    const motorbikeAutoMakers = await MotorbikeAutoMaker.find();
    if (motorbikeAutoMakers.length === 0) {
      res.status(404);
      throw new Error("Have no Motorbike-AutoMaker found");
    }
    res.status(200).json(motorbikeAutoMakers);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const createMotorbikeAutoMaker = asyncHandler(async (req, res, next) => {
  try {
    const motorbikeAutoMakerParam = req.body.autoMaker;
    if (!motorbikeAutoMakerParam) {
      res.status(404);
      throw new Error("Motorbike-AutoMaker not found");
    }
    if (!motorbikeAutoMakerParam) {
      res.status(404);
      throw new Error("AutoMaker is required");
    }
    const isExist = await MotorbikeAutoMaker.findOne({
      name: motorbikeAutoMakerParam,
    });
    if (isExist) {
      res.status(400);
      throw new Error("Motorbike-AutoMaker has already been exists");
    }
    const motorbikeAutoMaker = await MotorbikeAutoMaker.create({
      name: motorbikeAutoMakerParam,
    });
    if (!motorbikeAutoMaker) {
      res.status(500);
      throw new Error("Something went wrong creating the Motorbike-AutoMaker");
    }
    res.status(201).json(motorbikeAutoMaker);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const deleteMotorbikeAutoMaker = asyncHandler(async (req, res, next) => {
  try {
    const motorbikeAutoMakerParam = req.body.autoMaker;
    if (!motorbikeAutoMakerParam) {
      res.status(404);
      throw new Error("Motorbike-AutoMaker not found");
    }
    const isExist = await MotorbikeAutoMaker.findOne({
      name: motorbikeAutoMakerParam,
    });
    if (!isExist) {
      res.status(404);
      throw new Error("Motorbike-AutoMaker not found");
    }
    const motorbikeAutoMaker = await MotorbikeAutoMaker.findOneAndDelete({
      name: motorbikeAutoMakerParam,
    });
    if (!motorbikeAutoMaker) {
      res.status(500);
      throw new Error("Something went wrong creating the Motorbike-AutoMaker");
    }
    res.status(201).json(motorbikeAutoMaker);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

module.exports = {
  getAllCarAutoMaker,
  createCarAutoMaker,
  deleteCarAutoMaker,
  getAllMotorbikeAutoMaker,
  createMotorbikeAutoMaker,
  deleteMotorbikeAutoMaker,
};
