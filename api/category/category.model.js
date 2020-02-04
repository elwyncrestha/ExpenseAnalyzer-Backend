const mongoose = require("mongoose");
const validator = require("validator");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: Number, // 0 = Expense, 1 = Income
      validate: value => {
        if (value != 0 && value !== 1) {
          throw new Error({ error: "Invalid category type" });
        }
      }
    }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
