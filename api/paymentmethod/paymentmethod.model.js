const mongoose = require("mongoose");

const paymentMethodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
});

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);

module.exports = PaymentMethod;
