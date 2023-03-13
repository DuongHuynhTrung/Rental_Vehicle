const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    licensePlate: {
      type: String,
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
      default: 'Processing',
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    hasDriver: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
