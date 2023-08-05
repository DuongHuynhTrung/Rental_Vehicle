const asyncHandler = require("express-async-handler");
const CarCategory = require("../models/Car/CarCategory");
const MotorbikeCategory = require("../models/Motorbike/MotorbikeCategory");

// Car Aut-Maker
const getAllCarCategory = asyncHandler(async (req, res, next) => {
  try {
    const carCategories = await CarCategory.find();
    if (!carCategories || carCategories.length === 0) {
      res.status(404);
      throw new Error("Have no Car-Category found");
    }
    res.status(200).json(carCategories);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const createCarCategory = asyncHandler(async (req, res, next) => {
  try {
    const { carCategoryParam, seat } = req.body;
    if (!carCategoryParam || !seat) {
      res.status(404);
      throw new Error("All fields are required");
    }
    const isExist = await CarCategory.findOne({ name: carCategoryParam });
    if (isExist) {
      res.status(400);
      throw new Error("Car-Category has already been exists");
    }
    const carCategory = await CarCategory.create({
      name: carCategoryParam,
      seat,
    });
    if (!carCategory) {
      res.status(500);
      throw new Error("Something went wrong creating the Car-Category");
    }
    res.status(201).json(carCategory);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const deleteCarCategory = asyncHandler(async (req, res, next) => {
  try {
    const { carCategoryParam } = req.body;
    if (!carCategoryParam) {
      res.status(404);
      throw new Error("Car-Category invalid");
    }
    const isExist = await CarCategory.findOne({ name: carCategoryParam });
    if (!isExist) {
      res.status(400);
      throw new Error("Car-Category not found");
    }
    const carCategory = await CarCategory.findOneAndDelete({
      name: carCategoryParam,
    });
    if (!carCategory) {
      res.status(500);
      throw new Error("Something went wrong creating the Car-Category");
    }
    res.status(201).json(carCategory);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

// Motorbike Auto-Maker
const getAllMotorbikeCategory = asyncHandler(async (req, res, next) => {
  try {
    const motorbikeCategories = await MotorbikeCategory.find();
    if (!motorbikeCategories || motorbikeCategories.length === 0) {
      res.status(404);
      throw new Error("Have no Motorbike-Category found");
    }
    res.status(200).json(motorbikeCategories);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const createMotorbikeCategory = asyncHandler(async (req, res, next) => {
  try {
    const { motorbikeCategoryParam } = req.body;
    if (!motorbikeCategoryParam) {
      res.status(404);
      throw new Error("MotorbikeCategory invalid");
    }
    const isExist = await MotorbikeCategory.findOne({
      name: motorbikeCategoryParam,
    });
    if (isExist) {
      res.status(400);
      throw new Error("Motorbike-Category has already been exists");
    }
    const motorbikeCategory = await MotorbikeCategory.create({
      name: motorbikeCategoryParam,
    });
    if (!motorbikeCategory) {
      res.status(500);
      throw new Error("Something went wrong creating the Motorbike-Category");
    }
    res.status(201).json(motorbikeCategory);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const deleteMotorbikeCategory = asyncHandler(async (req, res, next) => {
  try {
    const { motorbikeCategoryParam } = req.body;
    if (!motorbikeCategoryParam) {
      res.status(404);
      throw new Error("Motorbike-Category invalid");
    }
    const isExist = await MotorbikeCategory.findOne({
      name: motorbikeCategoryParam,
    });
    console.log(motorbikeCategoryParam);
    console.log(isExist);
    if (!isExist) {
      res.status(400);
      throw new Error("Motorbike-Category not found");
    }
    const motorbikeCategory = await MotorbikeCategory.findOneAndDelete({
      name: motorbikeCategoryParam,
    });
    if (!motorbikeCategory) {
      res.status(500);
      throw new Error("Something went wrong creating the Motorbike-Category");
    }
    res.status(201).json(motorbikeCategory);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

module.exports = {
  getAllCarCategory,
  createCarCategory,
  deleteCarCategory,
  getAllMotorbikeCategory,
  createMotorbikeCategory,
  deleteMotorbikeCategory,
};
