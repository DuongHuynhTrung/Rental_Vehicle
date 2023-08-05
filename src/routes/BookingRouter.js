const express = require("express");
const bodyParser = require("body-parser");
const bookingRouter = express.Router();

const {
  createBooking,
  getBookingById,
  cancelBooking,
  getAllBookings,
  getAllBookingsOfUser,
  deleteBookingsForAdmin,
  returnVehicleAfterBooking,
  getAllBookingsOfHotelier,
  cancelCustomerBooking,
  cancelOwnerBooking,
  changeStatusBooking,
} = require("../app/controllers/BookingController");

const { validateToken } = require("../app/middleware/validateTokenHandler");

bookingRouter.use(bodyParser.json());

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Booking:
 *        type: object
 *        properties:
 *          user_id:
 *            type: object
 *            description: User's Id
 *          licensePlates:
 *            type: string
 *            description: enter vehicle's licensePlates
 *            example: HE46-48261
 *          bookingStart:
 *            type: Date
 *            description: enter booking start date
 *            example: 22-12-2022
 *          bookingEnd:
 *            type: Date
 *            description: enter booking end date
 *            example: 23-12-2022
 *          hasDriver:
 *            type: boolean
 *            description: Checking if has driver
 *            example: true
 */

bookingRouter.use(validateToken);

bookingRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })

  /**
   * @swagger
   * /api/bookings:
   *  post:
   *    tags:
   *      - Bookings
   *    summary: Create a new booking
   *    description: Create a new booking
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               licensePlate:
   *                  type: string
   *                  description: enter vehicle license plate
   *                  example: H5-41445
   *               bookingStart:
   *                  type: date
   *                  description: enter booking start date
   *                  example: 2023-03-04
   *               bookingEnd:
   *                  type: date
   *                  description: enter booking end date
   *                  example: 2023-03-06
   *               hasDriver:
   *                  type: boolean
   *                  description: Do you want to have the driver
   *                  example: false
   *    responses:
   *      201:
   *        description: A new booking is created
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Create booking successfully
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/Booking'
   *      400:
   *        description: All field not be empty! OR Vehicle has already booked by other Customer! OR Vehicle data is not Valid
   *      404:
   *        description: Vehicle not Found!
   *
   */

  .post(createBooking)

  /**
   * @swagger
   * /api/bookings:
   *  get:
   *    tags:
   *      - Bookings
   *    summary: Get all booking of a customer
   *    description: Get all booking of a customer
   *    responses:
   *      200:
   *        description: Return all booking of a customer
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Get all booking of a customer
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/Booking'
   *      404:
   *        description: Customer don't have any Booking!
   *
   */

  .get(getAllBookingsOfUser);

/**
 * @swagger
 * /api/bookings/hotelier:
 *  get:
 *    tags:
 *      - Bookings
 *    summary: Get all booking of a Hotelier
 *    description: Get all booking of a Hotelier
 *    responses:
 *      200:
 *        description: Return all booking of a Hotelier
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: Get all booking of a Hotelier
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Booking'
 *      404:
 *        description: Hotelier don't have any Booking!
 *
 */
bookingRouter.route("/hotelier").get(getAllBookingsOfHotelier);

/**
 * @swagger
 * /api/bookings/admin:
 *  get:
 *    tags:
 *      - Bookings
 *    summary: Get all booking in the system
 *    description: Get all booking in the system
 *    responses:
 *      200:
 *        description: Return all booking in the system
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: Get all booking in the system
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Booking'
 *      403:
 *        description: Only admin can get all Bookings!
 *      404:
 *        description: System don't have any bookings!
 *
 */

bookingRouter.route("/admin").get(getAllBookings);

bookingRouter
  .route("/:bookingId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })

  /**
   * @swagger
   * /api/bookings/{bookingId}:
   *  get:
   *    tags:
   *      - Bookings
   *    summary: Get booking of a customer
   *    description: Get booking of a customer
   *    parameters:
   *      - name: bookingId
   *        in: path
   *        required: true
   *        description: Booking
   *        type: string
   *    responses:
   *      200:
   *        description: Return booking of a customer
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Get booking of a customer
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/Booking'
   *      404:
   *        description: Customer don't have any Booking!
   *
   */

  .get(getBookingById)

  /**
   * @swagger
   * /api/bookings/{bookingId}:
   *  delete:
   *    tags:
   *      - Bookings
   *    summary: Delete Booking for admin
   *    description: Delete Booking for admin
   *    parameters:
   *      - name: bookingId
   *        in: path
   *        required: true
   *        description: Booking
   *        type: string
   *    responses:
   *      200:
   *        description: Booking deleted successfully
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                description:
   *                  type: string
   *                  example: Delete Booking for admin
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/Booking'
   *      403:
   *        description: You don't have permission to delete other customer booking's!
   *      404:
   *        description: Booking Not Found!
   *      500:
   *        description: Something went wrong of change status in deleting booking! OR Something went wrong in cancelling booking!
   *
   */
  .delete(deleteBookingsForAdmin);

/**
 * @swagger
 * /api/bookings/{bookingId}/cancel:
 *  get:
 *    tags:
 *      - Bookings
 *    summary: User or Admin can Cancel a booking
 *    description: User or Admin can Cancel a booking
 *    parameters:
 *      - name: bookingId
 *        in: path
 *        required: true
 *        description: Booking
 *        type: string
 *    responses:
 *      200:
 *        description: Booking canceled successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: User or Admin can Cancel a booking
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Booking'
 *      403:
 *        description: You don't have permission to cancel other customer booking's!
 *      404:
 *        description: Booking Not Found!
 *      500:
 *        description: Something went wrong of change status in cancelling booking! OR Something went wrong in cancelling booking!
 *
 */
bookingRouter.route("/:bookingId/cancel").get(cancelBooking);

/**
 * @swagger
 * /api/bookings/{bookingId}/return:
 *  get:
 *    tags:
 *      - Bookings
 *    summary: Hotelier confirm after customer return vehicle
 *    description: Hotelier confirm after customer return vehicle
 *    parameters:
 *      - name: bookingId
 *        in: path
 *        required: true
 *        description: Booking
 *        type: string
 *    responses:
 *      200:
 *        description: Bookings has been completed
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: Hotelier confirm after customer return vehicle
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Booking'
 *      400:
 *        description: Booking status is not suitable!
 *      403:
 *        description: Only Hotels are allowed! OR Only Vehicle owners can do this action!
 *      404:
 *        description: Booking Not Found! OR Vehicle not found!
 *      500:
 *        description: Something went wrong with change status vehicle in return vehicle after booking
 *
 */
bookingRouter.route("/:bookingId/return").get(returnVehicleAfterBooking);

bookingRouter.route("/cancelCustomer").post(cancelCustomerBooking);

bookingRouter.route("/cancelOwner").post(cancelOwnerBooking);

bookingRouter.route("/changeBookingStatus").post(changeStatusBooking);

module.exports = bookingRouter;
