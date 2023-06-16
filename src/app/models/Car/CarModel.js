const mongoose = require("mongoose");

const CarModelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    autoMaker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarAutoMaker",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CarModel", CarModelSchema);
