const Expense = require("../models/expense");

const User = require("../models/user");

exports.showAllLeaderbord = async (req, res) => {
  try {
    let user = req.user;

    if (user.premium === undefined || !user.premium) {
      return res.status(401).json({
        success: false,
        message: "Buy Premium Membership To access this feature",
      });
    }

    let leaderboard = await User.find()
      .select("name expenseDetails.total _id")
      .sort({ "expenseDetails.total": -1 });
    // .populate("expenseDetails.expenses" );

    res.json({
      requestUserId: req.user._id,
      leaderboard,
    });
  } catch (error) {
    console.log("\n showAllLeaderbord ==> \n ", error);

    res.status(500).json({ success: false, message: error.message });
  }
};

exports.showUserExpense = async (req, res) => {
  try {
    let user = req.user;

    let userId = req.body.userId;

    if (user.premium === undefined || !user.premium) {
      return res.status(401).json({
        success: false,
        message: "Buy Premium Membership To access this feature",
      });
    }

    let usersExp = await User.findById({ _id: userId })
      .select("expenseDetails.expenses")
      .populate("expenseDetails.expenses");

    if (usersExp.length == 0) {
      return res.json({
        success: true,
        message: "No expense Found ",
        usersExp,
      });
    }

    res.status(200).json({ success: true, usersExp });
  } catch (error) {
    console.log("\n showAllLeaderbord ==> \n ", error);

    res.status(500).json({ success: false, message: error.message });
  }
};
