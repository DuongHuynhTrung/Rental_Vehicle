const mongoose = require("mongoose");

const MotorbikeModelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    autoMaker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MotorbikeAutoMaker",
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("MotorbikeModel", MotorbikeModelSchema);
