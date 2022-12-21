const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  premium: {
    type: Boolean,
  },

  expenseDetails: {
    total: {
      type: Number,
    },

    expenses: [Schema.Types.ObjectId],
  },
});

module.exports = model("User", userSchema);

// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");

// // create new model
// const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   membership: {
//     type: Sequelize.DataTypes.STRING,
//     allowNull: false,
//     defaultValue: "free",
//   },
// });

// module.exports = User;
