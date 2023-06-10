const mongoose = require("mongoose");

const MotorbikeCategorySchema = mongoose.Schema(
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

module.exports = mongoose.model("MotorbikeCategory", MotorbikeCategorySchema);
