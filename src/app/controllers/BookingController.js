const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Voucher = require("../models/Voucher");
const moment = require("moment/moment");
const { default: mongoose } = require("mongoose");

//@desc Get all Booking Of User
//@route GET /api/bookings/hotelier
//@access private
const getAllBookingsOfHotelier = asyncHandler(async (req, res, next) => {
  try {
    const vehicle = await Vehicle.find({ user_id: req.user.id });
    const allBookings = await Booking.find()
      .populate("user_id")
      .populate("vehicle_id")
      .populate("user_canceled")
      .populate("voucher_id")
      .exec();
    let bookings = [];
    vehicle.forEach((vehicle) => {
      allBookings.forEach((booking) =>
        booking.vehicle_id._id === vehicle._id ? bookings.push(booking) : null
      );
    });
    if (bookings.length === 0) {
      res.status(404);
      throw new Error("Hotelier don't have any Booking!");
    }
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get all Booking Of User
//@route GET /api/bookings
//@access private
const getAllBookingsOfUser = asyncHandler(async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user_id: req.user.id })
      .populate("user_id")
      .populate("vehicle_id")
      .populate("user_canceled")
      .populate("voucher_id")
      .exec();
    if (bookings.length === 0) {
      res.status(404);
      throw new Error("Customer don't have any Booking!");
    }
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get all Booking Of User
//@route GET /api/booking/:userId
//@access private
const getAllBookings = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.roleName !== "Admin") {
      res.status(403);
      throw new Error("Only admin can get all Bookings!");
    }
    const bookings = await Booking.find()
      .populate("user_id")
      .populate("vehicle_id")
      .populate("user_canceled")
      .populate("voucher_id")
      .exec();
    if (bookings.length === 0) {
      res.status(404);
      throw new Error("System don't have any bookings!");
    }
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const changeStatusVehicle = asyncHandler(async (vehicle) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      { _id: vehicle._id },
      { isRented: !vehicle.isRented }
    );
    return !!updatedVehicle;
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  }
});

//@desc Register New Vehicle
//@route POST /api/booking
//@access private
const createBooking = asyncHandler(async (req, res, next) => {
  try {
    const roleUser = req.user.roleName;
    if (roleUser !== "Customer") {
      res.status(403);
      throw new Error("Only customers can be created for booking");
    }
    const { licensePlate, bookingStart, bookingEnd, voucherCode } = req.body;
    if (
      licensePlate === undefined ||
      bookingStart === undefined ||
      bookingEnd === undefined
    ) {
      res.status(400);
      throw new Error("All field not be empty!");
    }
    const vehicleAvailable = await Vehicle.findOne({ licensePlate });
    if (!vehicleAvailable) {
      res.status(404);
      throw new Error("Vehicle not Found!");
    }
    if (vehicleAvailable.isRented) {
      res.status(500);
      throw new Error("Vehicle has already booked by other Customer!");
    }
    if (voucherCode === undefined) {
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
        vehicle_id: vehicleAvailable._id.toString(),
        bookingStart: start,
        bookingEnd: end,
        totalPrice: totalPrice,
      });
      if (!booking) {
        res.status(500);
        throw new Error("Something went wrong when trying to book");
      }
      const isChange = changeStatusVehicle(vehicleAvailable);
      if (!isChange) {
        res.status(400);
        throw new Error("Something went wrong when changing vehicle status");
      }

      res.status(201).json(booking);
    } else {
      const voucher = await Voucher.findOne({ code: voucherCode }).populate({
        path: "user_id",
        populate: {
          path: "role_id",
          model: "Role",
        },
      });
      if (!voucher) {
        res.status(404);
        throw new Error("Voucher not found");
      }
      if (voucher.user_id.role_id.roleName === "Admin") {
        if (voucher.isPercent) {
          const start = new Date(bookingStart);
          const end = new Date(bookingEnd);
          const get_day_of_rent = (start, end) => {
            let bookingStart = start.getTime();
            let bookingEnd = end.getTime();
            return Math.ceil(
              (bookingEnd - bookingStart) / (24 * 60 * 60 * 1000)
            );
          };
          const totalDayBooking = get_day_of_rent(start, end);
          const totalPrice =
            totalDayBooking *
            vehicleAvailable.price *
            (voucher.discount_amount / 100);

          const booking = await Booking.create({
            user_id: req.user.id,
            vehicle_id: vehicleAvailable._id.toString(),
            bookingStart: start,
            bookingEnd: end,
            totalPrice: totalPrice,
          });
          if (!booking) {
            res.status(500);
            throw new Error("Something went wrong when trying to book");
          }
          const isChange = changeStatusVehicle(vehicleAvailable);
          if (!isChange) {
            res.status(400);
            throw new Error(
              "Something went wrong when changing vehicle status"
            );
          }

          res.status(201).json(booking);
        } else {
          const start = new Date(bookingStart);
          const end = new Date(bookingEnd);
          const get_day_of_rent = (start, end) => {
            let bookingStart = start.getTime();
            let bookingEnd = end.getTime();
            return Math.ceil(
              (bookingEnd - bookingStart) / (24 * 60 * 60 * 1000)
            );
          };
          const totalDayBooking = get_day_of_rent(start, end);
          const totalPrice =
            totalDayBooking * vehicleAvailable.price - voucher.discount_amount;

          const booking = await Booking.create({
            user_id: req.user.id,
            vehicle_id: vehicleAvailable._id.toString(),
            bookingStart: start,
            bookingEnd: end,
            totalPrice: totalPrice,
          });
          if (!booking) {
            res.status(500);
            throw new Error("Something went wrong when trying to book");
          }
          const isChange = changeStatusVehicle(vehicleAvailable);
          if (!isChange) {
            res.status(400);
            throw new Error(
              "Something went wrong when changing vehicle status"
            );
          }

          res.status(201).json(booking);
        }
      } else {
        if (voucher.isPercent) {
          const start = new Date(bookingStart);
          const end = new Date(bookingEnd);
          const get_day_of_rent = (start, end) => {
            let bookingStart = start.getTime();
            let bookingEnd = end.getTime();
            return Math.ceil(
              (bookingEnd - bookingStart) / (24 * 60 * 60 * 1000)
            );
          };
          const totalDayBooking = get_day_of_rent(start, end);
          const totalPrice =
            totalDayBooking *
            (vehicleAvailable.price * (voucher.discount_amount / 100));

          const booking = await Booking.create({
            user_id: req.user.id,
            vehicle_id: vehicleAvailable._id.toString(),
            bookingStart: start,
            bookingEnd: end,
            totalPrice: totalPrice,
          });
          if (!booking) {
            res.status(500);
            throw new Error("Something went wrong when trying to book");
          }
          const isChange = changeStatusVehicle(vehicleAvailable);
          if (!isChange) {
            res.status(400);
            throw new Error(
              "Something went wrong when changing vehicle status"
            );
          }

          res.status(201).json(booking);
        } else {
          const start = new Date(bookingStart);
          const end = new Date(bookingEnd);
          const get_day_of_rent = (start, end) => {
            let bookingStart = start.getTime();
            let bookingEnd = end.getTime();
            return Math.ceil(
              (bookingEnd - bookingStart) / (24 * 60 * 60 * 1000)
            );
          };
          const totalDayBooking = get_day_of_rent(start, end);
          const totalPrice =
            totalDayBooking *
            (vehicleAvailable.price - voucher.discount_amount);

          const booking = await Booking.create({
            user_id: req.user.id,
            vehicle_id: vehicleAvailable._id.toString(),
            bookingStart: start,
            bookingEnd: end,
            totalPrice: totalPrice,
          });
          if (!booking) {
            res.status(500);
            throw new Error("Something went wrong when trying to book");
          }
          const isChange = changeStatusVehicle(vehicleAvailable);
          if (!isChange) {
            res.status(400);
            throw new Error(
              "Something went wrong when changing vehicle status"
            );
          }

          res.status(201).json(booking);
        }
      }
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc Get Vehicle
//@route GET /api/bookings/:id
//@access private
const getBookingById = asyncHandler(async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId)
      .populate("user_id")
      .populate("vehicle_id")
      .populate("user_canceled")
      .populate("voucher_id")
      .exec();
    if (!booking) {
      res.status(404);
      throw new Error("Booking Not Found!");
    }
    const userId = booking.user_id.toString();
    if (req.user.id !== userId) {
      res.status(403);
      throw new Error(
        "You don't have permission to get other customer booking's information"
      );
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

//@desc Update Vehicle
//@route PUT /api/Booking/:bookingId
//@access private
const cancelBooking = asyncHandler(async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId)
      .populate("user_id")
      .populate("vehicle_id")
      .populate("user_canceled")
      .populate("voucher_id")
      .exec();
    if (!booking) {
      res.status(404);
      throw new Error("Booking Not Found!");
    }
    const userId = booking.user_id._id.toString();
    if (req.user.id !== userId) {
      res.status(403);
      throw new Error(
        "You don't have permission to cancel other customer booking's!"
      );
    }
    const cancelBooking = await Booking.findByIdAndUpdate(
      { _id: bookingId },
      {
        bookingStatus: "Cancelled",
      },
      {
        new: true,
      }
    );
    if (!cancelBooking) {
      res.status(500);
      throw new Error("Something went wrong in cancelling booking!");
    }
    const vehicle = await Vehicle.findOne({
      licensePlate: booking.vehicle_id.licensePlate,
    });
    if (vehicle) {
      changeStatusVehicle(vehicle);
    } else {
      res.status(500);
      throw new Error(
        "Something went wrong of change status in cancelling booking!"
      );
    }
    res.status(200).json(cancelBooking);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

//@desc Delete Vehicle
//@route DELETE /api/bookings/:bookingId
//@access private
const deleteBookingsForAdmin = asyncHandler(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const booking = await Booking.findById(bookingId)
    .populate("user_id")
    .populate("vehicle_id")
    .populate("user_canceled")
    .populate("voucher_id")
    .exec();
  if (!booking) {
    res.status(404);
    throw new Error("Booking Not Found!");
  }
  if (req.user.roleName !== "Admin") {
    res.status(403);
    throw new Error(
      "You don't have permission to get other customer booking's information"
    );
  }
  const bookingStatus = booking.bookingStatus;
  if (bookingStatus === "Processing") {
    res.status(500);
    throw new Error("This booking is already in progress");
  }
  const deleteBooking = await Booking.findByIdAndDelete(booking._id);
  if (deleteBooking) {
    res.status(200).json(deleteBooking);
  } else {
    res.status(500);
    throw new Error("Something went wrong in deleting booking");
  }
});

//@desc change vehicle status when customer returns vehicle
//@route GET /api/bookings/:bookingId
//@access private
const returnVehicleAfterBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.bookingId;
  const booking = await Booking.findById(bookingId)
    .populate("user_id")
    .populate("vehicle_id")
    .populate("user_canceled")
    .populate("voucher_id")
    .exec();
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (req.user.roleName !== "Hotelier") {
    res.status(403);
    throw new Error("Only Business are allowed!");
  }
  if (booking.bookingStatus !== "Processing") {
    res.status(400);
    throw new Error("Booking status is not suitable!");
  }
  const vehicle = await Vehicle.findOne({
    licensePlate: booking.vehicle_id.licensePlate,
  });
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found!");
  }
  if (req.user.id.toString() !== vehicle.user_id.toString()) {
    res.status(403);
    throw new Error("Only Vehicle owners can do this action!");
  }
  const isChange = changeStatusVehicle(vehicle);
  if (!isChange) {
    res.status(500);
    throw new Error(
      "Something went wrong with change status vehicle in return vehicle after booking"
    );
  }
  const updateBooking = await Booking.findByIdAndUpdate(
    { _id: bookingId },
    {
      bookingStatus: "Completed",
    },
    {
      new: true,
    }
  )
    .populate("user_id")
    .populate("vehicle_id")
    .populate("user_canceled")
    .populate("voucher_id")
    .exec();
  if (!updateBooking) {
    res.status(500);
    throw new Error("Something went wrong in return vehicle after booking");
  }
  res.status(200).json(updateBooking);
});

//@desc change vehicle status
//@route POST /api/bookings/changeStatus
//@access private
const changeStatusBooking = asyncHandler(async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      res.status(404);
      throw new Error("Invalid booking id");
    }
    const booking = await Booking.findById(bookingId)
      .populate("user_id")
      .populate("vehicle_id")
      .populate("user_canceled")
      .populate("voucher_id")
      .exec();
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found!");
    }
    const status = booking.bookingStatus;
    switch (status) {
      case "Pending": {
        if (req.user.roleName !== "Owner" && req.user.roleName !== "Hotelier") {
          res.status(403);
          throw new Error("Only Owner can do this action!");
        }
        if (booking.vehicle_id.user_id._id.toString() !== req.user.id) {
          res.status(403);
          throw new Error("Only owner of the vehicle can do this action");
        }
        const changeStatusBooking = await Booking.findByIdAndUpdate(
          bookingId,
          {
            bookingStatus: "Paying",
          },
          {
            new: true,
          }
        );
        if (!changeStatusBooking) {
          res.status(500);
          throw new Error("Something went wrong in changeling status booking!");
        }
        res.status(200).json(changeStatusBooking);
        break;
      }
      case "Paying": {
        if (req.user.roleName !== "Customer") {
          res.status(403);
          throw new Error("Only customers can do this action!");
        }
        if (booking.user_id._id.toString() !== req.user.id) {
          res.status(403);
          throw new Error("Only customers who booked can do this action");
        }
        const changeStatusBooking = await Booking.findByIdAndUpdate(
          bookingId,
          {
            bookingStatus: "Processing",
          },
          {
            new: true,
          }
        );
        if (!changeStatusBooking) {
          res.status(500);
          throw new Error("Something went wrong in changeling status booking!");
        }
        res.status(200).json(changeStatusBooking);
        break;
      }
      case "Processing": {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          if (req.user.roleName !== "Admin") {
            res.status(403);
            throw new Error("Only admin can check payment status");
          }
          const admin = await User.findById(req.user.id);
          if (!admin) {
            res.status(500);
            throw new Error(
              "Something went wrong when fetching admin information"
            );
          }
          const adminProfit = admin.profit + booking.totalPrice;
          const updateAdminProfit = await User.findByIdAndUpdate(
            req.user.id,
            {
              profit: adminProfit,
            },
            {
              new: true,
            }
          );
          if (!updateAdminProfit) {
            res.status(500);
            throw new Error("Something went wrong updating admin profit");
          }
          const changeStatusBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
              bookingStatus: "Delivering",
              isPaid: true,
            },
            {
              new: true,
            }
          );
          if (!changeStatusBooking) {
            res.status(500);
            throw new Error(
              "Something went wrong in changeling status booking!"
            );
          }
          //commit the transaction
          await session.commitTransaction();
          session.endSession();

          res.status(200).json(changeStatusBooking);
        } catch (error) {
          await session.abortTransaction();
          session.endSession();

          res.status(res.statusCode).send(error.message);
        }
        break;
      }
      case "Delivering": {
        if (req.user.roleName !== "Owner" && req.user.roleName !== "Hotelier") {
          res.status(403);
          throw new Error("Only Owner can do this action!");
        }
        if (booking.vehicle_id.user_id._id.toString() !== req.user.id) {
          res.status(403);
          throw new Error("Only owner of the vehicle can do this action");
        }
        const changeStatusBooking = await Booking.findByIdAndUpdate(
          bookingId,
          {
            bookingStatus: "Delivered",
          },
          {
            new: true,
          }
        );
        if (!changeStatusBooking) {
          res.status(500);
          throw new Error("Something went wrong in changing status booking!");
        }
        res.status(200).json(changeStatusBooking);
        break;
      }
      case "Delivered": {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          if (
            req.user.roleName !== "Owner" &&
            req.user.roleName !== "Hotelier"
          ) {
            res.status(403);
            throw new Error("Only Owner can do this action!");
          }
          if (booking.vehicle_id.user_id._id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("Only owner of the vehicle can do this action");
          }

          const admin = await User.findOne({
            role_id: "63e4730f62bf96d8df480f58",
          });
          if (!admin) {
            res.status(404);
            throw new Error(
              "Something went wrong. Cannot find admin with role_id"
            );
          }
          const owner = await User.findById(booking.vehicle_id.user_id._id);
          if (!owner) {
            res.status(404);
            throw new Error(
              "Something went wrong when fetching owner of vehicle"
            );
          }
          const adminProfit = admin.profit - booking.totalPrice * 0.9;
          const updateAdminProfit = await User.findByIdAndUpdate(
            admin._id,
            {
              profit: adminProfit,
            },
            {
              new: true,
            }
          );
          if (!updateAdminProfit) {
            res.status(500);
            throw new Error("Something went wrong when updating admin profit");
          }
          const ownerProfit = owner.profit + booking.totalPrice * 0.9;
          const updateOwnerProfit = await User.findByIdAndUpdate(
            owner._id,
            {
              profit: ownerProfit,
            },
            {
              new: true,
            }
          );
          if (!updateOwnerProfit) {
            res.status(500);
            throw new Error("Something went wrong when updating owner profit");
          }
          const vehicle = await Vehicle.findById(booking.vehicle_id._id);
          if (!vehicle) {
            res.status(404);
            throw new Error(
              "Something went wrong. Vehicle in booking not found"
            );
          }
          const isChangeVehicleStatus = changeStatusVehicle(vehicle);
          if (!isChangeVehicleStatus) {
            res.status(500);
            throw new Error(
              "Something went wrong when changing vehicle status"
            );
          }
          const changeStatusBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
              bookingStatus: "Completed",
            },
            {
              new: true,
            }
          );
          if (!changeStatusBooking) {
            res.status(500);
            throw new Error(
              "Something went wrong in changeling status booking!"
            );
          }
          //commit the transaction
          await session.commitTransaction();
          session.endSession();

          res.status(200).json(changeStatusBooking);
        } catch (error) {
          await session.abortTransaction();
          session.endSession();

          res.status(res.statusCode).send(error.message);
        }
        break;
      }
      case "Completed": {
        if (req.user.roleName !== "Admin") {
          res.status(403);
          throw new Error("Only admin can check payment status");
        }
        const isTransferred = await Booking.findByIdAndUpdate(
          bookingId,
          {
            isTransferred: true,
          },
          {
            new: true,
          }
        );
        if (!isTransferred) {
          res.status(500);
          throw new Error("Something went wrong when checking isTransferred!");
        }
        res.status(200).json(isTransferred);
        break;
      }
      default:
        res.status(404).send("Status not fixed with any cases");
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc change vehicle status
//@route POST /api/bookings/cancelCustomer
//@access private
const cancelCustomerBooking = asyncHandler(async (req, res, next) => {
  try {
    const { bookingId, cancelReason } = req.body;
    if (!bookingId) {
      res.status(404);
      throw new Error("Invalid booking id");
    }
    const booking = await Booking.findById(bookingId)
      .populate("user_id")
      .populate("vehicle_id")
      .populate("user_canceled")
      .populate("voucher_id")
      .exec();
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found!");
    }
    if (req.user.roleName !== "Customer") {
      res.status(403);
      throw new Error("Only customers can do this action!");
    }
    if (booking.user_id._id.toString() !== req.user.id) {
      res.status(403);
      throw new Error("Only customers who booked can do this action");
    }
    const status = booking.bookingStatus;
    switch (status) {
      case "Pending": {
        const cancelBooking = await Booking.findByIdAndUpdate(
          bookingId,
          {
            bookingStatus: "Cancelled",
            user_canceled: booking.user_id._id.toString(),
            cancel_reason: cancelReason,
          },
          {
            new: true,
          }
        );
        if (!cancelBooking) {
          res.status(500);
          throw new Error("Something went wrong in cancelling booking!");
        }
        const vehicle = await Vehicle.findById(booking.vehicle_id._id);
        if (!vehicle) {
          res.status(404);
          throw new Error("Something went wrong! Vehicle was not found");
        }
        const isChange = changeStatusVehicle(vehicle);
        if (!isChange) {
          res.status(500);
          throw new Error("Something went wrong when changing vehicle status");
        }
        res.status(200).json(cancelBooking);
        break;
      }
      case "Paying": {
        const userId = booking.user_id._id.toString();
        if (req.user.id !== userId) {
          res.status(403);
          throw new Error(
            "You don't have permission to cancel other customer booking's!"
          );
        }
        const cancelBooking = await Booking.findByIdAndUpdate(
          bookingId,
          {
            bookingStatus: "Cancelled",
            user_canceled: booking.user_id._id.toString(),
            cancel_reason: cancelReason,
          },
          {
            new: true,
          }
        );
        if (!cancelBooking) {
          res.status(500);
          throw new Error("Something went wrong in cancelling booking!");
        }
        const vehicle = await Vehicle.findById(booking.vehicle_id._id);
        if (!vehicle) {
          res.status(404);
          throw new Error("Something went wrong! Vehicle was not found");
        }
        const isChange = changeStatusVehicle(vehicle);
        if (!isChange) {
          res.status(500);
          throw new Error("Something went wrong when changing vehicle status");
        }
        res.status(200).json(cancelBooking);
        break;
      }
      case "Processing": {
        const userId = booking.user_id._id.toString();
        if (req.user.id !== userId) {
          res.status(403);
          throw new Error(
            "You don't have permission to cancel other customer booking's!"
          );
        }
        const paidTime = moment(booking.createdAt);
        const now = moment();
        const startDate = moment(booking.bookingStart);

        const timeDiff = now.diff(paidTime);
        const dateDiff = startDate.diff(now);
        const durationTime = moment.duration(timeDiff);
        const durationDate = moment.duration(dateDiff);

        const hoursDiff = durationTime.asHours();
        const dayDiff = durationDate.asDays();
        switch (true) {
          case hoursDiff <= 1: {
            const cancelBooking = await Booking.findByIdAndUpdate(
              bookingId,
              {
                bookingStatus: "Cancelled",
                user_canceled: booking.user_id._id.toString(),
                cancel_reason: cancelReason,
              },
              {
                new: true,
              }
            );
            if (!cancelBooking) {
              res.status(500);
              throw new Error("Something went wrong in cancelling booking!");
            }
            const vehicle = await Vehicle.findById(booking.vehicle_id._id);
            if (!vehicle) {
              res.status(404);
              throw new Error("Something went wrong! Vehicle was not found");
            }
            const isChange = changeStatusVehicle(vehicle);
            if (!isChange) {
              res.status(500);
              throw new Error(
                "Something went wrong when changing vehicle status"
              );
            }
            res.status(200).json({
              bookingId,
              cancelReason,
              percent: "100%",
              totalPrice: booking.totalPrice,
            });
            break;
          }
          case dayDiff <= 7: {
            const cancelBooking = await Booking.findByIdAndUpdate(
              bookingId,
              {
                bookingStatus: "Cancelled",
                user_canceled: booking.user_id._id.toString(),
                cancel_reason: cancelReason,
              },
              {
                new: true,
              }
            );
            if (!cancelBooking) {
              res.status(500);
              throw new Error("Something went wrong in cancelling booking!");
            }
            const vehicle = await Vehicle.findById(booking.vehicle_id._id);
            if (!vehicle) {
              res.status(404);
              throw new Error("Something went wrong! Vehicle was not found");
            }
            const isChange = changeStatusVehicle(vehicle);
            if (!isChange) {
              res.status(500);
              throw new Error(
                "Something went wrong when changing vehicle status"
              );
            }
            res.status(200).json({
              bookingId,
              cancelReason,
              percent: "70%",
              totalPrice: booking.totalPrice,
            });
            break;
          }
          default: {
            const cancelBooking = await Booking.findByIdAndUpdate(
              bookingId,
              {
                bookingStatus: "Cancelled",
                user_canceled: booking.user_id._id.toString(),
                cancel_reason: cancelReason,
              },
              {
                new: true,
              }
            );
            if (!cancelBooking) {
              res.status(500);
              throw new Error("Something went wrong in cancelling booking!");
            }
            const vehicle = await Vehicle.findById(booking.vehicle_id._id);
            if (!vehicle) {
              res.status(404);
              throw new Error("Something went wrong! Vehicle was not found");
            }
            const isChange = changeStatusVehicle(vehicle);
            if (!isChange) {
              res.status(500);
              throw new Error(
                "Something went wrong when changing vehicle status"
              );
            }
            res.status(200).json({
              bookingId,
              cancelReason,
              percent: "0%",
              totalPrice: booking.totalPrice,
            });
            break;
          }
        }
        break;
      }
      default:
        res.status(404).send("Status not fixed with any cases");
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

//@desc change vehicle status
//@route POST /api/bookings/cancelOwner
//@access private
const cancelOwnerBooking = asyncHandler(async (req, res, next) => {
  try {
    const { bookingId, cancelReason } = req.body;
    if (!bookingId) {
      res.status(404);
      throw new Error("Invalid booking id");
    }
    const booking = await Booking.findById(bookingId)
      .populate("user_id")
      .populate({
        path: "vehicle_id",
        populate: {
          path: "user_id",
          model: "User",
        },
      })
      .populate("user_canceled")
      .populate("voucher_id")
      .exec();
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found!");
    }
    if (booking.vehicle_id.user_id._id.toString() !== req.user.id) {
      res.status(403);
      throw new Error("Only owner of the vehicle can do this action");
    }
    if (req.user.roleName !== "Owner" && req.user.roleName !== "Hotelier") {
      res.status(403);
      throw new Error("Only Owner can do this action!");
    }
    const status = booking.bookingStatus;
    switch (status) {
      case "Pending": {
        const userId = booking.user_id._id.toString();
        if (req.user.id !== userId) {
          res.status(403);
          throw new Error(
            "You don't have permission to cancel other customer booking's!"
          );
        }
        const cancelBooking = await Booking.findByIdAndUpdate(
          { _id: bookingId },
          {
            bookingStatus: "Cancelled",
            user_canceled: booking.user_id._id.toString(),
            cancel_reason: cancelReason,
          },
          {
            new: true,
          }
        );
        if (!cancelBooking) {
          res.status(500);
          throw new Error("Something went wrong in cancelling booking!");
        }
        const vehicle = await Vehicle.findById(booking.vehicle_id._id);
        if (!vehicle) {
          res.status(404);
          throw new Error("Something went wrong! Vehicle was not found");
        }
        const isChange = changeStatusVehicle(vehicle);
        if (!isChange) {
          res.status(500);
          throw new Error("Something went wrong when changing vehicle status");
        }
        res.status(200).json(cancelBooking);
        break;
      }
      case "Paying": {
        const userId = booking.user_id._id.toString();
        if (req.user.id !== userId) {
          res.status(403);
          throw new Error(
            "You don't have permission to cancel other customer booking's!"
          );
        }
        const cancelBooking = await Booking.findByIdAndUpdate(
          { _id: bookingId },
          {
            bookingStatus: "Cancelled",
            user_canceled: booking.user_id._id.toString(),
            cancel_reason: cancelReason,
          },
          {
            new: true,
          }
        );
        if (!cancelBooking) {
          res.status(500);
          throw new Error("Something went wrong in cancelling booking!");
        }
        const vehicle = await Vehicle.findById(booking.vehicle_id._id);
        if (!vehicle) {
          res.status(404);
          throw new Error("Something went wrong! Vehicle was not found");
        }
        const isChange = changeStatusVehicle(vehicle);
        if (!isChange) {
          res.status(500);
          throw new Error("Something went wrong when changing vehicle status");
        }
        res.status(200).json(cancelBooking);
        break;
      }
      case "Processing": {
        const userId = booking.user_id._id.toString();
        if (req.user.id !== userId) {
          res.status(403);
          throw new Error(
            "You don't have permission to cancel other customer booking's!"
          );
        }
        const paidTime = moment(booking.createdAt);
        const now = moment();
        const startDate = moment(booking.bookingStart);

        const timeDiff = now.diff(paidTime);
        const dateDiff = startDate.diff(now);
        const durationTime = moment.duration(timeDiff);
        const durationDate = moment.duration(dateDiff);

        const hoursDiff = durationTime.asHours();
        const dayDiff = durationDate.asDays();

        switch (true) {
          case hoursDiff <= 1: {
            const cancelBooking = await Booking.findByIdAndUpdate(
              bookingId,
              {
                bookingStatus: "Cancelled",
                user_canceled: booking.user_id._id.toString(),
                cancel_reason: cancelReason,
              },
              {
                new: true,
              }
            );
            if (!cancelBooking) {
              res.status(500);
              throw new Error("Something went wrong in cancelling booking!");
            }
            const vehicle = await Vehicle.findById(booking.vehicle_id._id);
            if (!vehicle) {
              res.status(404);
              throw new Error("Something went wrong! Vehicle was not found");
            }
            const isChange = changeStatusVehicle(vehicle);
            if (!isChange) {
              res.status(500);
              throw new Error(
                "Something went wrong when changing vehicle status"
              );
            }
            res.status(200).json({
              bookingId,
              cancelReason,
              percent: "0%",
              totalPrice: booking.totalPrice,
            });
            break;
          }
          case dayDiff <= 7: {
            const cancelBooking = await Booking.findByIdAndUpdate(
              bookingId,
              {
                bookingStatus: "Cancelled",
                user_canceled: booking.user_id._id.toString(),
                cancel_reason: cancelReason,
              },
              {
                new: true,
              }
            );
            if (!cancelBooking) {
              res.status(500);
              throw new Error("Something went wrong in cancelling booking!");
            }
            const vehicle = await Vehicle.findById(booking.vehicle_id._id);
            if (!vehicle) {
              res.status(404);
              throw new Error("Something went wrong! Vehicle was not found");
            }
            const isChange = changeStatusVehicle(vehicle);
            if (!isChange) {
              res.status(500);
              throw new Error(
                "Something went wrong when changing vehicle status"
              );
            }
            res.status(200).json({
              bookingId,
              cancelReason,
              percent: "30%",
              totalPrice: booking.totalPrice,
            });
            break;
          }
          default: {
            const cancelBooking = await Booking.findByIdAndUpdate(
              bookingId,
              {
                bookingStatus: "Cancelled",
                user_canceled: booking.user_id._id.toString(),
                cancel_reason: cancelReason,
              },
              {
                new: true,
              }
            );
            if (!cancelBooking) {
              res.status(500);
              throw new Error("Something went wrong in cancelling booking!");
            }
            const vehicle = await Vehicle.findById(booking.vehicle_id._id);
            if (!vehicle) {
              res.status(404);
              throw new Error("Something went wrong! Vehicle was not found");
            }
            const isChange = changeStatusVehicle(vehicle);
            if (!isChange) {
              res.status(500);
              throw new Error(
                "Something went wrong when changing vehicle status"
              );
            }
            res.status(200).json({
              bookingId,
              cancelReason,
              percent: "100%",
              totalPrice: booking.totalPrice,
            });
            break;
          }
        }
        break;
      }
      default:
        res.status(404).send("Status not fixed with any cases");
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
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
  changeStatusBooking,
  cancelCustomerBooking,
  cancelOwnerBooking,
};
