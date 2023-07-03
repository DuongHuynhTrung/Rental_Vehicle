const express = require("express");
const bodyParser = require("body-parser");
const commentRouter = express.Router();

const {
  createComment,
  getCommentByUserId,
  getCommentByVehicleId,
} = require("../app/controllers/CommentController");
const { validateToken } = require("../app/middleware/validateTokenHandler");

commentRouter.use(bodyParser.json());
commentRouter.use(validateToken);

commentRouter.route("/").post(createComment);

commentRouter.route("/users").get(getCommentByUserId);

commentRouter.route("/vehicles").get(getCommentByVehicleId);

module.exports = commentRouter;
