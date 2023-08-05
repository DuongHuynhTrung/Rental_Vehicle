const mongoose = require("mongoose");

const MotorbikeSchema = mongoose.Schema(
  {
    vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    autoMaker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MotorbikeAutoMaker",
      required: true,
    },
    model_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MotorbikeModel",
      required: true,
    },
    fuel: {
      type: String,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MotorbikeCategory",
      required: true,
    },
    otherFacilities: {
      type: [Number],
      description: "Some convenient the car have",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Motorbike", MotorbikeSchema);
