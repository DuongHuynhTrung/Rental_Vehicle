const express = require('express');
const paypalRouter = express.Router();
const {
  paypalVehicle,
  paypalSuccess,
} = require('../app/controllers/PaypalController');

paypalRouter.route('/').get(paypalVehicle);

paypalRouter.route('/success').get(paypalSuccess);

paypalRouter.route('/cancel', (req, res) => res.status(500).json('Cancelled'));

module.exports = paypalRouter;
