const paypal = require('paypal-rest-sdk');
const dotenv = require('dotenv').config();

paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: process.env.PAYPAL_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

module.exports = paypal;
