const express = require("express");
const bodyParser = require("body-parser");
const userRouter = express.Router();
const {
  getUsers,
  registerUser,
  getUserById,
  updateUsers,
  deleteUsers,
  loginUser,
  currentUserInfo,
} = require("../app/controllers/UserController");
const validateToken = require("../app/middleware/validateTokenHandler");

userRouter.use(bodyParser.json());
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.use(validateToken);
userRouter
  .route("/")
  //   .all((req, res, next) => {
  //     res.statusCode = 200;
  //     res.setHeader("Content-Type", "json/plain");
  //     next();
  //   })
  .get(getUsers);

userRouter.get("/current", currentUserInfo);

userRouter
  .route("/:id")
  //   .all((req, res, next) => {
  //     res.statusCode = 200;
  //     res.setHeader("Content-Type", "json/plain");
  //     next();
  //   })
  .get(getUserById)
  .put(updateUsers)
  .delete(deleteUsers);

module.exports = userRouter;
