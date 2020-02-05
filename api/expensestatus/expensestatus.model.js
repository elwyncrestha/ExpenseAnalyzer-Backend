const mongoose = require("mongoose");

const expensestatusSchema = mongoose.Schema(
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

const ExpenseStatus = mongoose.model("ExpenseStatus", expensestatusSchema);

module.exports = ExpenseStatus;
