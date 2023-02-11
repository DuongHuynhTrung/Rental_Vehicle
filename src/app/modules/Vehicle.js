const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    licensePlate: {
      type: String,
      required: [true, "Please add vehicle's license plates."],
      unique: true,
    },
    description: {
      type: String,
      maxLength: 255,
    },
    insurance: {
      type: String,
      required: [true, "Please add vehicle's insurance."],
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
