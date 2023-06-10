const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not Authorized!");
      }
      req.user = decoded.user;
      next();
    });
    if (!token) {
      res.status(401);
      throw new Error("User is not Authorized or token is missing");
    }
  } else {
    res.status(401);
    throw new Error("Missing Access Token!");
  }
});

const validateTokenAdmin = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not Authorized!");
      }
      if (decoded.user.roleName === "Admin") {
        res.status(403);
        throw new Error("You are not allowed to access this");
      }
      req.user = decoded.user;
      next();
    });
    if (!token) {
      res.status(401);
      throw new Error("User is not Authorized or token is missing");
    }
  } else {
    res.status(401);
    throw new Error("Missing Access Token!");
  }
});

module.exports = { validateToken, validateTokenAdmin };
