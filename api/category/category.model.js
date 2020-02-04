const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subCategory: [
    {
      name: {
        type: String,
        required: true
      }
    }
  ]
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
