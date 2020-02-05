const mongoose = require("mongoose");

const paymentMethodSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);

module.exports = PaymentMethod;
