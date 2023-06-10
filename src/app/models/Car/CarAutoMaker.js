const mongoose = require("mongoose");

const CarAutoMakerSchema = mongoose.Schema(
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

module.exports = mongoose.model("CarAutoMaker", CarAutoMakerSchema);
