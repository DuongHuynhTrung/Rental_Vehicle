const mongoose = require("mongoose");

const CarAutoMakerSchema = mongoose.Schema(
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

module.exports = mongoose.model("CarAutoMaker", CarAutoMakerSchema);
