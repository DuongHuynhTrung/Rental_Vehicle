const mongoose = require("mongoose");

const CarCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    seat: {
      type: Number,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("CarCategory", CarCategorySchema);
