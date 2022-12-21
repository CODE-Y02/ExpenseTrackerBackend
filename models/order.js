const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  server_order_id: String,
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,

  isVarified: {
    type: Boolean,
  },

  amount: {
    type: Number,
  },

  receipt: String,

  status: String,

  createdAt: Date,

  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = model("Order", orderSchema);
