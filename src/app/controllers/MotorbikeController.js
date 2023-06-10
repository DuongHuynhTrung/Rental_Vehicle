const asyncHandler = require("express-async-handler");
const Motorbike = require("../models/Motorbike/Motorbike");
const XLSX = require("xlsx");
const User = require("../models/User");
const MotorbikeAutoMaker = require("../models/Motorbike/MotorbikeAutoMaker");
const MotorbikeModel = require("../models/Motorbike/MotorbikeModel");
const MotorbikeCategory = require("../models/Motorbike/MotorbikeCategory");

//@desc Get all Motorbikes Of User
//@route GET /api/Motorbikes
//@access private
const getMotorbikesOfUser = asyncHandler(async (req, res, next) => {
  try {
    const motorbikes = await Motorbike.find({ user_id: req.user.id })
      .populate("autoMaker_id")
      .populate("model_id")
      .populate("category_id")
      .populate("user_id")
      .populate("comment_id")
      .exec();
    if (!motorbikes) {
      res.status(500);
      throw new Error("Something went wrong when fetching Motorbikes of user");
    }
    if (motorbikes.length === 0) {
      res.status(404);
      throw new Error("User don't register any Motorbike!");
    }
    res.status(200).json(motorbikes);
  } catch (error) {
    res.status(res.statusCode).send(error.message);
  }
});

//@desc Get all Motorbikes to Welcome Page
//@route GET /api/Motorbikes/home
//@access private
const getAllMotorbikes = asyncHandler(async (req, res, next) => {
  try {
    const motorbikes = await Motorbike.find()
      .populate("autoMaker_id")
      .populate("model_id")
      .populate("category_id")
      .populate("user_id")
      .populate("comment_id")
      .exec();
    if (!motorbikes) {
      res.status(500);
      throw new Error("Something went wrong when getting all Motorbikes");
    }
    if (motorbikes.length === 0) {
      res.status(404);
      throw new Error("Website don't have any Motorbike!");
    }
    res.status(200).json(motorbikes);
  } catch (error) {
    res.status(res.statusCode).send(error.message);
  }
});

//@desc Register New Motorbike
//@route POST /api/Motorbikes
//@access private
const registerMotorbike = asyncHandler(async (req, res, next) => {
  try {
    const {
      licensePlate,
      description,
      autoMaker,
      model,
      insurance,
      fuel,
      category,
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
      yearOfManufacturer === undefined ||
      price === undefined ||
      otherFacilities === undefined ||
      images === undefined ||
      mortgage === undefined
    ) {
      res.status(400);
      throw new Error("All field not be empty!");
    }
    const isMotorbikeExist = await Motorbike.findOne({ licensePlate });
    if (isMotorbikeExist) {
      res.status(400);
      throw new Error("Motorbike has already registered with License Plates!");
    }
    const motorbikeAutoMaker = await MotorbikeAutoMaker.findOne({
      name: autoMaker,
    });
    if (!motorbikeAutoMaker) {
      res.status(404);
      throw new Error("AutoMaker Not Found");
    }
    const motorbikeModel = await MotorbikeModel.findOne({ name: model });
    if (!motorbikeModel) {
      res.status(404);
      throw new Error("Model Not Found");
    }
    const motorbikeCategory = await MotorbikeCategory.findOne({
      name: category,
    });
    if (!motorbikeCategory) {
      res.status(404);
      throw new Error("Category Not Found");
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User Not Found");
    }
    const motorbike = await Motorbike.create({
      name: MotorbikeModel.name + yearOfManufacturer,
      licensePlate,
      description,
      autoMaker_id: MotorbikeAutoMaker._id.toString(),
      model_id: MotorbikeModel._id.toString(),
      price,
      fuel,
      category_id: MotorbikeCategory._id.toString(),
      yearOfManufacturer,
      location: user.address,
      insurance,
      mortgage,
      otherFacilities,
      images,
      user_id: user._id.toString(),
    });
    if (motorbike) {
      res.status(201).json(motorbike);
    } else {
      res.status(400);
      throw new Error("Motorbike data is not Valid");
    }
  } catch (error) {
    res.status(res.statusCode).send(error.message);
  }
});

//@desc Get Motorbike
//@route GET /api/Motorbikes/:licensePlate
//@access private
const getMotorbikeByLicensePlate = asyncHandler(async (req, res, next) => {
  try {
    const licensePlate = req.params.licensePlate;
    if (!licensePlate) {
      res.status(404);
      throw new Error("Invalid licensePlate");
    }
    const motorbike = await Motorbike.findOne({ licensePlate })
      .populate("autoMaker_id")
      .populate("model_id")
      .populate("category_id")
      .populate("user_id")
      .populate("comment_id")
      .exec();
    if (!motorbike) {
      res.status(404);
      throw new Error("Motorbike Not Found!");
    }
    res.status(200).json(motorbike);
  } catch (error) {
    res.status(res.statusCode).send(error.message);
  }
});

//@desc Update Motorbike
//@route PUT /api/Motorbikes/:id
//@access private
const updateMotorbikes = asyncHandler(async (req, res, next) => {
  try {
    const licensePlateParam = req.params.licensePlate;
    const {
      licensePlate,
      desc,
      image,
      autoMaker,
      model,
      insurance,
      fuel,
      category,
      yearOfManufacturer,
      price,
      mortgage,
      otherFacilities,
      images,
    } = req.body;
    if (
      !licensePlate ||
      !desc ||
      !image ||
      !autoMaker ||
      !model ||
      !insurance ||
      !fuel ||
      !category ||
      !yearOfManufacturer ||
      !price ||
      !otherFacilities ||
      !images ||
      !mortgage
    ) {
      res.status(400);
      throw new Error("All field not be empty!");
    }
    const motorbike = await Motorbike.findOne({ licensePlateParam })
      .populate("autoMaker_id")
      .populate("model_id")
      .populate("category_id")
      .populate("user_id")
      .populate("comment_id")
      .exec();
    if (!motorbike) {
      res.status(404);
      throw new Error("Motorbike Not Found!");
    }

    const userId = Motorbike.user_id.toString();
    if (userId !== req.user.id) {
      res.status(403);
      throw new Error(
        "You don't have permission to update Motorbike's information!"
      );
    }
    const updateMotorbike = await Motorbike.findByIdAndUpdate(
      Motorbike._id.toString(),
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updateMotorbike);
  } catch (error) {
    res.status(res.statusCode).send(error.message);
  }
});

//@desc Delete Motorbike
//@route DELETE /api/Motorbikes/:id
//@access private
const deleteMotorbikes = asyncHandler(async (req, res, next) => {
  try {
    const licensePlate = req.params.licensePlate;
    if (!licensePlate) {
      res.status(404);
      throw new Error("Invalid license");
    }
    const motorbike = await Motorbike.findOne({ licensePlate })
      .populate("autoMaker_id")
      .populate("model_id")
      .populate("category_id")
      .populate("user_id")
      .populate("comment_id")
      .exec();
    if (!motorbike) {
      res.status(404);
      throw new Error("Motorbike Not Found!");
    }
    const userId = Motorbike.user_id.toString();
    if (userId !== req.user.id) {
      res.status(403);
      throw new Error("You don't have permission to update other Motorbike!");
    }
    const deleteMotorbike = await Motorbike.deleteOne({ _id: Motorbike._id });
    if (!deleteMotorbike) {
      res.status(500);
      throw new Error("Something went wrong deleting the Motorbike!");
    }
    res.status(200).json(deleteMotorbike);
  } catch (error) {
    res.status(res.statusCode).send(error.message);
  }
});

const uploadMotorbikeFromExcel = async (req, res, next) => {
  try {
    const workbook = XLSX.readFile(req.file.path, { sheetStubs: true });
    const sheet_nameList = workbook.SheetNames;
    let x = 0;
    sheet_nameList.forEach(async () => {
      const xlData = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_nameList[x]]
      );
      xlData.forEach(async (item) => {
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
        const mortgage = item.mortgage;
        const otherFacilities = item.otherFacilities;

        const isDuplicate = await Motorbike.findOne({
          licensePlate,
        });
        if (!isDuplicate) {
          const motorbikeAutoMaker = await MotorbikeAutoMaker.findOne({
            name: autoMaker,
          });
          if (!motorbikeAutoMaker) {
            res.status(404);
            throw new Error("AutoMaker Not Found");
          }
          const motorbikeModel = await MotorbikeModel.findOne({ name: model });
          if (!motorbikeModel) {
            res.status(404);
            throw new Error("Model Not Found");
          }
          const motorbikeCategory = await MotorbikeCategory.findOne({
            name: category,
          });
          if (!motorbikeCategory) {
            res.status(404);
            throw new Error("Category Not Found");
          }
          const user = await User.findById(req.user.id);
          if (!user) {
            res.status(404);
            throw new Error("User Not Found");
          }
          const motorbike = await Motorbike.create({
            name: MotorbikeModel.name + yearOfManufacturer,
            licensePlate,
            description,
            autoMaker_id: MotorbikeAutoMaker._id.toString(),
            model_id: MotorbikeModel._id.toString(),
            price,
            fuel,
            category_id: MotorbikeCategory._id.toString(),
            yearOfManufacturer,
            location: user.address,
            insurance,
            mortgage,
            otherFacilities,
            images,
            user_id: user._id.toString(),
          });
          if (!motorbike) {
            res.status(400);
            throw new Error(
              "Something went wrong with the Excel file. Please check Motorbikeefully!"
            );
          }
        }
      });
      x++;
    });
    res.status(201).json({
      message: `Successfully loaded excel file! Total Motorbikes: ${x}`,
    });
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
};

module.exports = {
  getMotorbikesOfUser,
  getAllMotorbikes,
  registerMotorbike,
  getMotorbikeByLicensePlate,
  updateMotorbikes,
  deleteMotorbikes,
  uploadMotorbikeFromExcel,
};
