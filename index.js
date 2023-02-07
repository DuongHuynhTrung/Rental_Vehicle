const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const errorHandler = require("./src/app/middleware/errorHandler");
const userRouter = require("./src/routes/UserRouter");
const vehicleRouter = require("./src/routes/VehicleRouter");
// const bookingRouter = require("./src/routes/BookingRouter");
const app = express();
const PORT = process.env.PORT || 5000;

//connect to DB
const db = require("./src/config/dbConnection");
db.connect();

//Json
app.use(bodyParser.json());

app.use("/api/users", userRouter);
app.use("/api/vehicles", vehicleRouter);
// app.use("/bookings", bookingRouter);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
