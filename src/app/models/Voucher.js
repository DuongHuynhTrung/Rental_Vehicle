const mongoose = require("mongoose");

const VoucherSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    discount_amount: {
      type: Number,
      required: true,
    },
    isPercent: {
      type: Boolean,
      required: true,
    },
    startDate: {
      type: Date,
      default: new Date(),
    },
    expiredDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Voucher", VoucherSchema);
