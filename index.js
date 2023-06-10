const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config({ path: "./config.env" });
const path = require("path");
const errorHandler = require("./src/app/middleware/errorHandler");
const userRouter = require("./src/routes/UserRouter");
const authRouter = require("./src/routes/AuthRouter");
const filterRouter = require("./src/routes/FilterRouter");
const bookingRouter = require("./src/routes/BookingRouter");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "My apis in swagger",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
      {
        url: `https://rental-vehicle-na07.onrender.com`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//connect to DB
const db = require("./src/config/dbConnection");
db.connect();

//Json
app.use(bodyParser.json());

// cookies Parser
app.use(cookieParser());

const expressSession = require("express-session");
const paypalRouter = require("./src/routes/PaypalRouter");
const carRouter = require("./src/routes/CarRouter");
const motorbikeRouter = require("./src/routes/MotorbikeRouter");
const vehicleRouter = require("./src/routes/VehicleRouter");
const autoMakerRouter = require("./src/routes/AutoMakerRouter");
const modelRouter = require("./src/routes/ModelRouter");
const voucherRouter = require("./src/routes/VoucherRouter");
const categoryRouter = require("./src/routes/CategoryRouter");

//Use Session
app.use(
  expressSession({
    secret: "jayantpatilapp",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//static folder path
app.use(express.static(path.resolve(__dirname, "public")));

// routers
app.use("/api/users", userRouter);
app.use("/api/cars", carRouter);
app.use("/api/motorbikes", motorbikeRouter);
app.use("/api/autoMakers", autoMakerRouter);
app.use("/api/models", modelRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/auth", authRouter);
app.use("/api/filters", filterRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/paypal", paypalRouter);
app.use("/api/vouchers", voucherRouter);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
