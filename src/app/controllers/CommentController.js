const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");

const createComment = asyncHandler(async (req, res) => {
  try {
    const user_id = req.user.id;
    const booking_id = req.body.booking_id;
    const booking = await Booking.findById(booking_id)
      .populate("user_id")
      .populate("vehicle_id")
      .populate("user_canceled")
      .populate("voucher_id")
      .exec();
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});
