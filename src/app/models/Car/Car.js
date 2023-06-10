const mongoose = require("mongoose");

const CarSchema = mongoose.Schema(
  {
    vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    autoMaker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarAutoMaker",
      required: true,
    },
    model_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarModel",
      required: true,
    },
    fuel: {
      type: String,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarCategory",
      required: true,
    },
    transmission: {
      type: String,
    },
    otherFacilities: {
      type: [Number],
      description: "Some convenient the car have",
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Car", CarSchema);
