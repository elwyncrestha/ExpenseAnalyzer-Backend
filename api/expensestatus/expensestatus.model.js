const mongoose = require("mongoose");

const expensestatusSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
});

const ExpenseStatus = mongoose.model("ExpenseStatus", expensestatusSchema);

module.exports = ExpenseStatus;
