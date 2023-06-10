const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    bookingStart: {
      type: Date,
      required: true,
    },
    bookingEnd: {
      type: Date,
      required: true,
    },
    bookingStatus: {
      type: String,
      default: "Pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    cancel_reason: {
      type: String,
    },
    user_canceled: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    voucher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
    },
    hasDriver: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
