const { Schema, model } = require("mongoose");

const downloadSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: false,
  },

  folder: {
    type: String,
    required: false,
  },
  fileName: {
    type: String,
    required: false,
  },

  user: {
    userId: Schema.Types.ObjectId,
    name: String,
    email: String,
  },

  downloadedAt: Date,
});

module.exports = model("Download", downloadSchema);
