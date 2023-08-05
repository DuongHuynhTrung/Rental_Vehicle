const express = require("express");
const bodyParser = require("body-parser");
const voucherRouter = express.Router();

const {
  getVouchersOfUser,
  getVoucherByCode,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} = require("../app/controllers/VoucherController");

const { validateToken } = require("../app/middleware/validateTokenHandler");

voucherRouter.use(bodyParser.json());

voucherRouter.use(validateToken);
voucherRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })
  .get(getVouchersOfUser)
  .post(createVoucher);

voucherRouter
  .route("/:voucherCode")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "json/plain");
    next();
  })
  .get(getVoucherByCode)
  .put(updateVoucher)
  .delete(deleteVoucher);

module.exports = voucherRouter;
