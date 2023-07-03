const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

const createComment = asyncHandler(async (req, res) => {
  try {
    const { comment, rate, booking_id } = req.body;
    if (!comment || !rate || !booking_id) {
      res.status(400);
      throw new Error("All fields are required!");
    }
    if (rate < 1 && rate > 5) {
      res.status(400);
      throw new Error("Rate must be between 1 and 5");
    }
    if (comment.length > 255) {
      res.status(400);
      throw new Error("Comment must be less than or equal 255 characters");
    }
    const booking = await Booking.findById(booking_id)
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
      throw new Error("Booking not found");
    }
    if (booking.bookingStatus !== "Completed") {
      res.status(500);
      throw new Error("Booking not completed");
    }
    const roleName = req.user.roleName;
    if (roleName === "Customer") {
      const customer_id = req.user.id;
      const customer = await User.findById(customer_id);
      if (!customer) {
        res.status(404);
        throw new Error("Couldn't find customer");
      }
      if (customer_id !== booking.user_id._id.toString()) {
        res.status(403);
        throw new Error(
          "You do not have permission to comment on this booking"
        );
      }
      const owner_id = booking.vehicle_id.user_id._id.toString();
      const owner = await User.findById(owner_id);
      if (!owner) {
        res.status(404);
        throw new Error("Couldn't find owner");
      }
      const vehicle_id = booking.vehicle_id._id.toString();
      const customerComment = await Comment.create({
        owner_id,
        customer_id,
        vehicle_id,
        comment,
        rate,
      });
      if (!customerComment) {
        res.status(500);
        throw new Error("Something went wrong when creating a comment");
      }
      //Update Owner Rate
      let rateOwner = owner.rate;
      if (rateOwner === 0) {
        rateOwner = customerComment.rate;
        const updateOwnerRate = await User.findByIdAndUpdate(owner_id, {
          rate: rateOwner,
        });
        if (!updateOwnerRate) {
          res.status(500);
          throw new Error("Something went wrong updating the customer rate");
        }
      } else {
        const ownerComment = await Comment.find({ owner_id });
        const rate = ownerComment.map((comment) => comment.rate);
        const sum = rate.reduce((acc, num) => acc + num, 0) + rateOwner;
        rateOwner = sum / (rate.length + 1);
        // Update user rate
        const updateOwnerRate = await User.findByIdAndUpdate(owner_id, {
          rate: rateOwner,
        });
        if (!updateOwnerRate) {
          res.status(500);
          throw new Error("Something went wrong updating the customer rate");
        }
      }
      // Update Vehicle Rate
      let rateVehicle = booking.vehicle_id.rate;
      if (rateVehicle === 0) {
        rateVehicle = customerComment.rate;
        const updateVehicleRate = await Vehicle.findByIdAndUpdate(vehicle_id, {
          rate: rateVehicle,
        });
        if (!updateVehicleRate) {
          res.status(500);
          throw new Error("Something went wrong updating the customer rate");
        }
      } else {
        const vehicleComment = await Comment.find({ vehicle_id });
        const rate = vehicleComment.map((comment) => comment.rate);
        const sum = rate.reduce((acc, num) => acc + num, 0) + rateVehicle;
        rateVehicle = sum / (rate.length + 1);
        // Update Vehicle rate
        const updateVehicleRate = await Vehicle.findByIdAndUpdate(vehicle_id, {
          rate: rateVehicle,
        });
        if (!updateVehicleRate) {
          res.status(500);
          throw new Error("Something went wrong updating the customer rate");
        }
      }
      res.status(201).json(customerComment);
    } else if (roleName === "Owner") {
      const owner_id = req.user.id;
      if (owner_id !== booking.vehicle_id.user_id._id.toString()) {
        res.status(403);
        throw new Error(
          "You do not have permission to comment on this booking"
        );
      }
      const customer_id = booking.user_id._id.toString();
      const customer = await User.findById(customer_id);
      const vehicle_id = booking.vehicle_id._id.toString();
      const customerComment = await Comment.create({
        owner_id,
        customer_id,
        vehicle_id,
        comment,
        rate,
      });
      if (!customerComment) {
        res.status(500);
        throw new Error("Something went wrong when creating a comment");
      }
      // Update Customer Rate
      let rateCustomer = customer.rate;
      if (rateCustomer === 0) {
        rateCustomer = customerComment.rate;
        const updateCustomerRate = await User.findByIdAndUpdate(customer_id, {
          rate: rateCustomer,
        });
        if (!updateCustomerRate) {
          res.status(500);
          throw new Error("Something went wrong updating the customer rate");
        }
      } else {
        const customerComment = await Comment.find({ customer_id });
        const rate = customerComment.map((comment) => comment.rate);
        const sum = rate.reduce((acc, num) => acc + num, 0) + rateCustomer;
        rateCustomer = sum / (rate.length + 1);
        // Update user rate
        const updateCustomerRate = await User.findByIdAndUpdate(customer_id, {
          rate: rateCustomer,
        });
        if (!updateCustomerRate) {
          res.status(500);
          throw new Error("Something went wrong updating the customer rate");
        }
      }
      res.status(201).json(customerComment);
    } else {
      res.status(403);
      throw new Error("You don't have permission to create comment");
    }
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const getCommentByUserId = asyncHandler(async (req, res) => {});

const updateComment = asyncHandler(async (req, res) => {});

module.exports = {
  createComment,
};
