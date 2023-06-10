const mongoose = require("mongoose");

const MotorbikeAutoMakerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("MotorbikeAutoMaker", MotorbikeAutoMakerSchema);
