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

// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");

// // create new model
// const Download = sequelize.define("download", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   type: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   fileUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   folder: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   fileName: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Download;
