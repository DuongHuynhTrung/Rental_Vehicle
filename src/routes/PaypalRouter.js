const express = require('express');
const paypalRouter = express.Router();
const {
  paypalVehicle,
  paypalSuccess,
} = require('../app/controllers/PaypalController');

/**
 * @swagger
 * /api/paypal/:
 *  get:
 *    tags:
 *      - PayPal Payments API
 *    summary: Customer pay rental service by PayPal
 *    description: Customer pay rental service by PayPal
 *    parameters:
 *      - name: bookingId
 *        in: query
 *        description: Booking id need to pay
 *        Required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A list of vehicles.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: Successfully fetched all data!
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Vehicle'
 *      500:
 *        description: Error in payment request
 *
 */
paypalRouter.route('/').get(paypalVehicle);

paypalRouter.route('/success').get(paypalSuccess);

paypalRouter.route('/cancel', (req, res) => res.status(500).json('Cancelled'));

module.exports = paypalRouter;
