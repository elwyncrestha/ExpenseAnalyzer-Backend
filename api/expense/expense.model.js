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
    },
    type: {
      type: Number, // 0 = Expense, 1 = Income
      validate: value => {
        if (value != 0 && value !== 1) {
          throw new Error({ error: "Invalid expense type" });
        }
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
