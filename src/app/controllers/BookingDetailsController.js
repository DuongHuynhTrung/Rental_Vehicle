const asyncHandler = require('express-async-handler');
const BookingDetails = require('../models/BookingDetails');
const Booking = require('../models/Booking');
const User = require('../models/User');

//@desc Register New bookingDetail
//@route POST /api/bookings/bookingDetails/:bookingId
//@access private
const createBookingDetails = asyncHandler(async (req, res, next) => {
  const { custName, custEmail, custPhone, custAddress, licensePlate } =
    req.body;
  if (!custName || !custEmail || !custPhone || !custAddress || !licensePlate) {
    res.status(400);
    throw new Error('All field not be empty!');
  }
  const bookingId = req.params.bookingId;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found!');
  }
  const bookingDetailsAvailable = await BookingDetails.findOne({
    booking_id: bookingId,
  });
  if (bookingDetailsAvailable) {
    res.status(400);
    throw new Error("This booking has already have booking's Details!");
  }
  const bookingDetail = await BookingDetails.create({
    booking_id: bookingId,
    custName,
    custEmail,
    custPhone,
    custAddress,
    licensePlate,
  });
  if (bookingDetail) {
    res.status(201).json(bookingDetail);
  } else {
    res.status(400);
    throw new Error('Booking Details data is not Valid');
  }
});

//@desc Get bookingDetail
//@route GET /api/bookings/bookingDetails/:bookingId
//@access private
const getBookingDetailsByBookingID = asyncHandler(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not Found!');
  }
  const bookingDetail = await BookingDetails.findOne({ booking_id: bookingId });
  if (!bookingDetail) {
    res.status(404);
    throw new Error("Booking don't have Details. Please add one!");
  }
  res.status(200).json(bookingDetail);
});

//@desc Update bookingDetail
//@route PUT /api/bookingDetails/:bookingId
//@access private
const updateBookingDetailsByBookingID = asyncHandler(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const booking = await Booking.findOne({ _id: bookingId });
  if (!booking) {
    res.status(404);
    throw new Error("Booking doesn't exist! Please check carefully!");
  }
  const bookingDetail = await BookingDetails.findOne({ bookingId });
  if (!bookingDetail) {
    res.status(404);
    throw new Error("booking don't have Details. Please add one!");
  }
  const { custName, custEmail, custPhone, custAddress, licensePlate } =
    req.body;
  if (!custName || !custEmail || !custPhone || !custAddress || !licensePlate) {
    res.status(400);
    throw new Error('All field not be empty!');
  }
  const bookingDetails_id = bookingDetail._id.toString();
  const updateBookingDetail = await BookingDetails.findByIdAndUpdate(
    bookingDetails_id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updateBookingDetail);
});

//@desc Delete bookingDetail
//@route DELETE /api/bookingDetails/:bookingId
//@access private
const deleteBookingDetailsByBookingID = asyncHandler(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const booking = await Booking.findOne({ _id: bookingId });
  if (!booking) {
    res.status(404);
    throw new Error('Booking not Found!');
  }
  const bookingDetail = await BookingDetails.findOne({ booking_id: bookingId });
  if (!bookingDetail) {
    res.status(404);
    throw new Error("Booking don't have Details. Please add one!");
  }
  const deleteBooking = await BookingDetails.deleteOne({
    _id: bookingDetail._id,
  });
  if (deleteBooking) {
    res.status(200).json(bookingDetail);
  } else {
    res.status(500);
    throw new Error('Something went wrong in deleting booking!');
  }
});

//@desc Get bookingDetail
//@route GET /api/bookings/bookingDetails/:bookingId/confirm
//@access private
const getBookingDetailsForConfirm = asyncHandler(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  if (req.user.roleName !== 'Customer') {
    res.status(403);
    throw new Error('Only customers can confirm booking!');
  }
  const customer = await User.findById(req.user.id);
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error(
      'Booking not found! Something went wrong in getBookingToConfirm!'
    );
  }
  res.status(200).json({
    custName: customer.lastName,
    custEmail: customer.email,
    custPhone: customer.phone,
    custAddress: customer.address,
    licensePlate: booking.licensePlate,
    totalPrice: booking.totalPrice,
  });
});

module.exports = {
  createBookingDetails,
  getBookingDetailsByBookingID,
  getBookingDetailsForConfirm,
  updateBookingDetailsByBookingID,
  deleteBookingDetailsByBookingID,
};
