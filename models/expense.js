const { Schema, model } = require("mongoose");

const expenseSchema = new Schema({
  expenseAmount: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },
  description: String,

  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = model("Expense", expenseSchema);
