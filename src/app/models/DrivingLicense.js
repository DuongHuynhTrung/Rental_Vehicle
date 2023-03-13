const mongoose = require('mongoose');

const drivingLicenseSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: [true, 'User should have driving license for rent vehicle'],
    },
    licenseNo: {
      type: Number,
      required: true,
      unique: true,
    },
    licenseClass: {
      type: String,
      length: 10,
      required: true,
    },
    expireDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model('DrivingLicense', drivingLicenseSchema);
