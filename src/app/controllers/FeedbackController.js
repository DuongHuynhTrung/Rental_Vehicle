const asyncHandler = require("express-async-handler");
const Feedback = require("../models/Feedback");

const createFeedback = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, contentFeedback } = req.body;
    if (!contentFeedback || !fullName || !email) {
      res.status(400);
      throw new Error("All fields are required");
    }
    const feedback = await Feedback.create({
      contentFeedback,
      email,
      fullName,
    });
    if (!feedback) {
      res.status(500);
      throw new Error("Something went wrong when creating feedback");
    }
    res.status(201).json(feedback);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const getAllFeedback = asyncHandler(async (req, res) => {
  try {
    if (req.user.roleName !== "Admin") {
      res.status(403);
      throw new Error("Only admin can get all feedback");
    }
    const feedbacks = await Feedback.find();
    if (!feedbacks || feedbacks.length === 0) {
      res.status(404);
      throw new Error("No feedback found");
    }
    res.status(200).json(feedbacks);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

const updateFeedbackStatus = asyncHandler(async (req, res) => {
  try {
    const feedback_id = req.body.feedback_id;
    const feedback = await Feedback.findById(feedback_id);
    if (!feedback) {
      res.status(404);
      throw new Error(`Feedback ${feedback_id} not found`);
    }
    const updateFeedback = await Feedback.findByIdAndUpdate(
      feedback_id,
      {
        newFeedback: false,
      },
      {
        new: true,
      }
    );
    if (!updateFeedback) {
      res.status(500);
      throw new Error("Something went wrong when updating newFeedback");
    }
    res.status(200).json(updateFeedback);
  } catch (error) {
    res
      .status(res.statusCode || 500)
      .send(error.message || "Internal Server Error");
  }
});

module.exports = {
  createFeedback,
  getAllFeedback,
  updateFeedbackStatus,
};
