const mongoose = require("mongoose");

const MotorbikeAutoMakerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MotorbikeAutoMaker", MotorbikeAutoMakerSchema);
