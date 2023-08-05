const asyncHandler = require("express-async-handler");
const Voucher = require("../models/Voucher");

const getVouchersOfUser = asyncHandler(async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const vouchers = await Voucher.findOne({ user_id });
    if (!vouchers || vouchers.length === 0) {
      res.status(404);
      throw new Error("User has no voucher");
    }
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const getVoucherByCode = asyncHandler(async (req, res, next) => {
  try {
    const code = req.params.voucherCode;
    if (code === undefined) {
      res.status(400);
      throw new Error(`Invalid voucher`);
    }
    const voucher = await Voucher.findOne({ code });
    if (!voucher) {
      res.status(404);
      throw new Error(`Voucher not found`);
    }
    res.status(200).json(voucher);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const createVoucher = asyncHandler(async (req, res, next) => {
  try {
    const {
      code,
      discount_amount,
      isPercent,
      startDate,
      expiredDate,
      description,
      quantity,
    } = req.body;
    if (
      code === undefined ||
      discount_amount === undefined ||
      isPercent === undefined ||
      startDate === undefined ||
      expiredDate === undefined ||
      description === undefined ||
      quantity === undefined
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }
    const isExist = await Voucher.findOne({ code });
    if (isExist) {
      res.status(400);
      throw new Error("Voucher Code has already been exists");
    }
    const user_id = req.user.id;
    const start = new Date(startDate);
    const end = new Date(expiredDate);
    const now = new Date();
    if (start > end || start > now) {
      res.status(400);
      throw new Error("Start Date is Invalid");
    }
    if (isPercent && (0 > discount_amount || discount_amount > 100)) {
      res.status(400);
      throw new Error("Discount Amount is between 0% and 100%");
    }
    if (!isPercent && (1000 > discount_amount || discount_amount > 1000000)) {
      res.status(400);
      throw new Error("Discount Amount is between 1.000 and 1.000.000");
    }
    const voucher = await Voucher.create({
      user_id,
      code,
      discount_amount,
      isPercent,
      startDate: start,
      expiredDate: end,
      description,
      quantity,
    });
    if (!voucher) {
      res.status(500);
      throw new Error("Something went wrong when creating the voucher");
    }
    res.status(201).json(voucher);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const updateVoucher = asyncHandler(async (req, res, next) => {
  try {
    const codeParam = req.params.voucherCode;
    const {
      discount_amount,
      isPercent,
      startDate,
      expiredDate,
      description,
      quantity,
    } = req.body;
    if (
      discount_amount === undefined ||
      isPercent === undefined ||
      startDate === undefined ||
      expiredDate === undefined ||
      description === undefined ||
      quantity === undefined
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }
    if (!codeParam) {
      res.status(404);
      throw new Error("Voucher Code is required");
    }
    const isExist = await Voucher.findOne({ code: codeParam });
    if (!isExist) {
      res.status(404);
      throw new Error("Voucher not found");
    }
    const start = new Date(startDate);
    const end = new Date(expiredDate);
    const now = new Date();
    if (start > end || start > now) {
      res.status(400);
      throw new Error("Start Date is Invalid");
    }
    const voucherUpdate = await Voucher.findOneAndUpdate(
      { code: codeParam },
      {
        discount_amount,
        isPercent,
        startDate: start,
        expiredDate: end,
        description,
        quantity,
      },
      {
        new: true,
      }
    );
    if (!voucherUpdate) {
      res.status(500);
      throw new Error("Something went wrong when creating the voucher");
    }
    res.status(200).json(voucherUpdate);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

const deleteVoucher = asyncHandler(async (req, res, next) => {
  try {
    const code = req.params.voucherCode;
    if (!code) {
      res.status(404);
      throw new Error("Voucher code is required");
    }
    const voucher = await Voucher.findOne({ code });
    if (!voucher) {
      res.status(404);
      throw new Error("Voucher not found");
    }
    const deleteVoucher = await Voucher.findOneAndDelete({ code });
    if (!deleteVoucher) {
      res.status(500);
      throw new Error("Something went wrong deleting Voucher");
    }
    res.status(200).json(deleteVoucher);
  } catch (error) {
    res.status(res.statusCode || 500).send(error.message);
  }
});

module.exports = {
  getVouchersOfUser,
  getVoucherByCode,
  createVoucher,
  updateVoucher,
  deleteVoucher,
};
