const { Schema, model } = require("mongoose");

// we will design it in such a way that user can have one forgot pass link at a time and once clicked it will be deactivated
const forgotPassSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  active: Boolean,
  passResetId: {
    type: String,
    uniquie: true,
    required: true,
  },
});

module.exports = model("ForgotPassword", forgotPassSchema);
