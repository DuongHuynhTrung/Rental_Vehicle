const mongoose = require("mongoose");

const MotorbikeCategorySchema = mongoose.Schema(
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

module.exports = mongoose.model("MotorbikeCategory", MotorbikeCategorySchema);
