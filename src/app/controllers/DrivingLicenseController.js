const asyncHandler = require("express-async-handler");
const DrivingLicense = require("../models/DrivingLicense");

//@desc Get drivingLicense Of User
//@route GET /api/users/drivingLicense
//@access private
const getDrivingLicenseOfUser = asyncHandler(async (req, res, next) => {
  try {
    const drivingLicense = await DrivingLicense.find({
      user_id: req.user.id,
    }).populate("user_id");
    if (!drivingLicense) {
      res.status(404);
      throw new Error("User doesn't register Driving License!");
    }
    res.status(200).json(drivingLicense);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Register New Driving License By User
//@route POST /api/user/drivingLicense
//@access private
const registerDrivingLicense = asyncHandler(async (req, res, next) => {
  const { licenseNo, licenseClass, expireDate, image } = req.body;
  if (!licenseNo || !licenseClass || !expireDate || !image) {
    res.status(400);
    throw new Error("All field not be empty!");
  }
  const date = new Date(expireDate);
  const drivingLicenseAvailable = await DrivingLicense.findOne({ licenseNo });
  if (drivingLicenseAvailable) {
    res.status(400);
    throw new Error(
      "Driving License Number has already registered by other User!"
    );
  }
  const drivingLicense = await DrivingLicense.create({
    user_id: req.user.id,
    licenseNo,
    licenseClass,
    expireDate: date,
    image,
  });
  if (!drivingLicense) {
    res.status(400);
    throw new Error("Driving License data is not Valid");
  }
  res.status(201).json(drivingLicense);
});

//@desc Update drivingLicense by user_id
//@route PUT /api/users/drivingLicense
//@access private
const updateDrivingLicense = asyncHandler(async (req, res, next) => {
  const drivingLicense = await DrivingLicense.findOne({ user_id: req.user.id });
  if (!drivingLicense) {
    res.status(404);
    throw new Error("User doesn't register Driving License!");
  }
  const { licenseNo, licenseClass, expireDate } = req.body;
  if (!licenseNo || !licenseClass || !expireDate) {
    res.status(400);
    throw new Error("All field not be empty!");
  }
  const userId = drivingLicense.user_id.toString();
  if (userId !== req.user.id) {
    res.status(403);
    throw new Error(
      "You don't have permission to update drivingLicense's information!"
    );
  }
  const drivingLicenseAvailable = await DrivingLicense.findOne({ licenseNo });
  if (drivingLicenseAvailable) {
    res.status(400);
    throw new Error(
      "Driving License Number has already registered by other User!"
    );
  }
  const updateDrivingLicense = await DrivingLicense.findByIdAndUpdate(
    drivingLicense._id.toString(),
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updateDrivingLicense);
});

//@desc Delete drivingLicense by user_id
//@route DELETE /api/users/drivingLicense
//@access private
const deleteDrivingLicense = asyncHandler(async (req, res, next) => {
  const drivingLicense = await DrivingLicense.findOne({ user_id: req.user.id });
  if (!drivingLicense) {
    res.status(404);
    throw new Error("User doesn't register Driving License!");
  }
  const userId = drivingLicense.user_id.toString();
  if (userId !== req.user.id) {
    res.status(403);
    throw new Error(
      "You don't have permission to delete other drivingLicense!"
    );
  }
  const deleteDrivingLicense = await DrivingLicense.deleteOne({
    _id: drivingLicense._id,
  });
  if (deleteDrivingLicense) res.status(200).json(drivingLicense);
});

//@desc Delete drivingLicense by user_id
//@route DELETE /api/users/confirmedLicense/:drivingLicense
//@access private
const confirmedDrivingLicense = asyncHandler(async (req, res, next) => {
  try {
    const licenseNo = req.params.drivingLicense;
    if (!licenseNo) {
      res.status(404);
      throw new Error(`Driving license with ${licenseNo} is invalid`);
    }
    const drivingLicense = await DrivingLicense.findOne({ licenseNo });
    if (!drivingLicense) {
      res.status(404);
      throw new Error(`Driving license with ${licenseNo} is not found`);
    }
    const confirmedDrivingLicense = await DrivingLicense.findByIdAndUpdate(
      drivingLicense.id,
      {
        isConfirmed: true,
      },
      {
        new: true,
      }
    );
    if (!confirmedDrivingLicense) {
      res.status(500);
      throw new Error(
        "Something went wrong when confirming the driver license"
      );
    }
    res.status(200).send("Confirmed driver license successfully");
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  getDrivingLicenseOfUser,
  registerDrivingLicense,
  updateDrivingLicense,
  deleteDrivingLicense,
  confirmedDrivingLicense,
};
