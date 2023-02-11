const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv').config({ path: './config.env' });
const errorHandler = require('./src/app/middleware/errorHandler');
const userRouter = require('./src/routes/UserRouter');
const vehicleRouter = require('./src/routes/VehicleRouter');
// const bookingRouter = require("./src/routes/BookingRouter");
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['*'],
};
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'My apis in swagger',
      version: '1.0.0',
    },
    servers: [
      {
        // url: `https://rental-vehicle-na07render.com`,
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//connect to DB
const db = require('./src/config/dbConnection');
db.connect();

//Json
app.use(bodyParser.json());

app.use('/api/users', userRouter);
app.use('/api/vehicles', vehicleRouter);
// app.use("/bookings", bookingRouter);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
