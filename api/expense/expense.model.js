const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now()
    },
    time: {
      type: String
    },
    amount: {
      type: Number,
      required: true,
      trim: true
    },
    payeeOrPayer: {
      type: String,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod"
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpenseStatus"
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
