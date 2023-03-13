const mongoose = require('mongoose');

const bookingDetailSchema = mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    custName: {
      type: String,
      required: true,
    },
    custEmail: {
      type: String,
      required: true,
    },
    custPhone: {
      type: String,
      required: true,
    },
    custAddress: {
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    payment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model('BookingDetail', bookingDetailSchema);
