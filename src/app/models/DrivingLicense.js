const mongoose = require("mongoose");

const drivingLicenseSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: [true, "User should have driving license for rent vehicle"],
    },
    licenseNo: {
      type: Number,
      required: true,
      maxLength: 12,
      unique: true,
    },
    licenseClass: {
      type: String,
      length: 10,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    expireDate: {
      type: Date,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DrivingLicense", drivingLicenseSchema);
