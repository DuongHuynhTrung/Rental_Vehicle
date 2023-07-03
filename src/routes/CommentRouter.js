const express = require("express");
const bodyParser = require("body-parser");
const commentRouter = express.Router();

const { createComment } = require("../app/controllers/CommentController");
const {
  validateToken,
  validateTokenAdmin,
} = require("../app/middleware/validateTokenHandler");

commentRouter.use(bodyParser.json());
commentRouter.use(validateToken);

commentRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })
  .post(createComment);

module.exports = commentRouter;
