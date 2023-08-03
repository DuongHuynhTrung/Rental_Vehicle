const express = require("express");
const bodyParser = require("body-parser");
const feedbackRouter = express.Router();

const {
  createFeedback,
  getAllFeedback,
  updateFeedbackStatus,
} = require("../app/controllers/FeedbackController");
const {
  validateTokenAdmin,
} = require("../app/middleware/validateTokenHandler");

feedbackRouter.use(bodyParser.json());

feedbackRouter.route("/").post(createFeedback);

feedbackRouter.use(validateTokenAdmin);

feedbackRouter.route("/").get(getAllFeedback);

feedbackRouter.route("/").put(updateFeedbackStatus);

module.exports = feedbackRouter;
