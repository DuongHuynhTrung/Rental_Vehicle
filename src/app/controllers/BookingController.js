const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

//@desc Get all Booking Of User
//@route GET /api/bookings/hotelier
//@access private
const getAllBookingsOfHotelier = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.find({ user_id: req.user.id });
  const allBookings = await Booking.find();
  let bookings = [];
  vehicle.forEach((vehicle) => {
    allBookings.forEach((booking) =>
      booking.licensePlate === vehicle.licensePlate
        ? bookings.push(booking)
        : null
    );
  });
  if (bookings.length === 0) {
    res.status(404);
    throw new Error("Hotelier don't have any Booking!");
  }
  res.status(200).json(bookings);
});

//@desc Get all Booking Of User
//@route GET /api/bookings
//@access private
const getAllBookingsOfUser = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user_id: req.user.id });
  if (bookings.length === 0) {
    res.status(404);
    throw new Error("Customer don't have any Booking!");
  }
  res.status(200).json(bookings);
});

//@desc Get all Booking Of User
//@route GET /api/booking/:userId
//@access private
const getAllBookings = asyncHandler(async (req, res, next) => {
  if (req.user.roleName !== 'Admin') {
    res.status(403);
    throw new Error('Only admin can get all Bookings!');
  }
  const bookings = await Booking.find().populate('user_id').exec();
  if (bookings.length === 0) {
    res.status(404);
    throw new Error("System don't have any bookings!");
  }
  res.status(200).json(bookings);
});

const changeStatusVehicle = asyncHandler(async (vehicle) => {
  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    { _id: vehicle._id },
    { isRented: !vehicle.isRented }
  );
  if (updatedVehicle) {
    return true;
  }
  return false;
});

//@desc Register New Vehicle
//@route POST /api/booking
//@access private
const createBooking = asyncHandler(async (req, res, next) => {
  const roleUser = req.user.roleName;
  if (roleUser !== 'Customer') {
    res.status(403);
    throw new Error('Only customers can be created for booking');
  }
  const { licensePlate, bookingStart, bookingEnd, hasDriver } = req.body;
  if (!licensePlate || !bookingStart || !bookingEnd || hasDriver == null) {
    res.status(400);
    throw new Error('All field not be empty!');
  }
  const vehicleAvailable = await Vehicle.findOne({ licensePlate });
  if (!vehicleAvailable) {
    res.status(404);
    throw new Error('Vehicle not Found!');
  }
  if (vehicleAvailable.isRented) {
    res.status(500);
    throw new Error('Vehicle has already booked by other Customer!');
  }
  const start = new Date(bookingStart);
  const end = new Date(bookingEnd);
  const get_day_of_rent = (start, end) => {
    let bookingStart = start.getTime();
    let bookingEnd = end.getTime();
    return Math.ceil((bookingEnd - bookingStart) / (24 * 60 * 60 * 1000));
  };
  const totalDayBooking = get_day_of_rent(start, end);
  const totalPrice = totalDayBooking * vehicleAvailable.price;
  const booking = await Booking.create({
    user_id: req.user.id,
    licensePlate,
    bookingStart: start,
    bookingEnd: end,
    totalPrice: totalPrice,
    hasDriver,
  });
  if (booking) {
    changeStatusVehicle(vehicleAvailable);
    const user = await User.findById(vehicleAvailable.user_id);
    if (user.profit === undefined) {
      user.profit = 0;
    }
    const profitUser = user.profit + totalPrice * 0.95;
    const updateProfitUser = await User.findByIdAndUpdate(
      vehicleAvailable.user_id,
      {
        profit: profitUser,
      }
    );
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    const profitAdmin = admin.profit + totalPrice * 0.05;
    const updateProfitAdmin = await User.findByIdAndUpdate(admin._id, {
      profit: profitAdmin,
    });
    if (updateProfitUser && updateProfitAdmin) {
      res.status(201).json(booking);
    } else {
      res.status(400);
      throw new Error('Something went wrong when updating user profit');
    }
  } else {
    res.status(500);
    throw new Error('Vehicle data is not Valid');
  }
});

//@desc Get Vehicle
//@route GET /api/bookings/:id
//@access private
const getBookingById = asyncHandler(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking Not Found!');
  }
  const userId = booking.user_id.toString();
  if (req.user.id !== userId) {
    res.status(403);
    throw new Error(
      "You don't have permission to get other customer booking's information"
    );
  }
  res.status(200).json(booking);
});

//@desc Update Vehicle
//@route PUT /api/Booking/:bookingId
//@access private
const cancelBooking = asyncHandler(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking Not Found!');
  }
  const userId = booking.user_id.toString();
  if (req.user.id !== userId && req.user.roleName !== 'Admin') {
    res.status(403);
    throw new Error(
      "You don't have permission to cancel other customer booking's!"
    );
  }
  const cancelBooking = await Booking.findByIdAndUpdate(
    { _id: bookingId },
    {
      bookingStatus: 'Cancelled',
    },
    {
      new: true,
    }
  );
  if (cancelBooking) {
    const vehicle = await Vehicle.findOne({
      licensePlate: booking.licensePlate,
    });
    if (vehicle) {
      changeStatusVehicle(vehicle);
    } else {
      res.status(500);
      throw new Error(
        'Something went wrong of change status in cancelling booking!'
      );
    }
    res.status(200).json(cancelBooking);
  } else {
    res.status(500);
    throw new Error('Something went wrong in cancelling booking!');
  }
});

//@desc Delete Vehicle
//@route DELETE /api/bookings/:bookingId
//@access private
const deleteBookingsForAdmin = asyncHandler(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking Not Found!');
  }
  if (req.user.roleName !== 'Admin') {
    res.status(403);
    throw new Error(
      "You don't have permission to get other customer booking's information"
    );
  }
  const bookingStatus = booking.bookingStatus;
  if (bookingStatus === 'Processing') {
    res.status(500);
    throw new Error('This booking is already in progress');
  }
  const deleteBooking = await Booking.findByIdAndDelete(booking._id);
  if (deleteBooking) {
    res.status(200).json(deleteBooking);
  } else {
    res.status(500);
    throw new Error('Something went wrong in deleting booking');
  }
});

//@desc change vehicle status when customer returns vehicle
//@route GET /api/bookings/:bookingId
//@access private
const returnVehicleAfterBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.bookingId;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (req.user.roleName !== 'Hotelier') {
    res.status(403);
    throw new Error('Only Hotels are allowed!');
  }
  if (booking.bookingStatus !== 'Processing') {
    res.status(400);
    throw new Error('Booking status is not suitable!');
  }
  const vehicle = await Vehicle.findOne({ licensePlate: booking.licensePlate });
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found!');
  }
  if (req.user.id.toString() !== vehicle.user_id.toString()) {
    res.status(403);
    throw new Error('Only Vehicle owners can do this action!');
  }
  const isChange = changeStatusVehicle(vehicle);
  if (!isChange) {
    res.status(500);
    throw new Error(
      'Something went wrong with change status vehicle in return vehicle after booking'
    );
  }
  const updateBooking = await Booking.findByIdAndUpdate(
    { _id: bookingId },
    {
      bookingStatus: 'Completed',
    },
    {
      new: true,
    }
  );
  if (!updateBooking) {
    res.status(500);
    throw new Error('Something went wrong in return vehicle after booking');
  }
  res.status(200).json(updateBooking);
});

module.exports = {
  getAllBookingsOfUser,
  createBooking,
  getBookingById,
  getAllBookings,
  cancelBooking,
  deleteBookingsForAdmin,
  returnVehicleAfterBooking,
  getAllBookingsOfHotelier,
};
