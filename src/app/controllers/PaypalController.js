const paypal = require('../../config/paypal');
const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');

const paypalVehicle = asyncHandler(async (req, res) => {
  const bookingId = req.query.bookingId;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  const payment = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://localhost:5001/api/paypal/success',
      cancel_url: 'http://localhost:5001/api/paypal/cancel',
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'Vehicle',
              licensePate: booking.licensePate,
              price: booking.totalPrice,
              currency: 'USD',
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: 'USD',
          total: booking.totalPrice,
        },
        description: 'This is the payment description.',
      },
    ],
  };

  paypal.payment.create(payment, (error, payment) => {
    if (error) {
      console.log(error);
    } else {
      for (const element of payment.links) {
        if (element.rel === 'approval_url') {
          res.redirect(element.href);
        }
      }
    }
  });
});

const paypalSuccess = asyncHandler(async (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    // transactions: [
    //   {
    //     amount: {
    //       currency: 'USD',
    //       total: '1.00',
    //     },
    //   },
    // ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.log(error);
    } else {
      console.log(JSON.stringify(payment));
      res.status(200).json('Payment successfully!');
    }
  });
});

module.exports = { paypalVehicle, paypalSuccess };
