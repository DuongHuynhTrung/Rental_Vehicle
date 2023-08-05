const mongoose = require("mongoose");

const vehicleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 255,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    yearOfManufacturer: {
      type: Number,
      required: true,
    },
    insurance: {
      type: Boolean,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    mortgage: {
      type: Boolean,
      required: true,
    },
    booked: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
