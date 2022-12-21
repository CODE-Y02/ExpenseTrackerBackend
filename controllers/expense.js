//models
const Expense = require("../models/expense");
const User = require("../models/user");
const Download = require("../models/download");
//utils
const { convertFromJSON_to_CSV } = require("../util/converters");

// services
const { uploadToS3 } = require("../services/S3service");
const { getExpenses, getDownloads } = require("../services/userServices");

module.exports.postAddExpense = async (req, res, next) => {
  try {
    const { expenseAmount, category, description } = req.body;

    if (!expenseAmount || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Field Cannot be empty" });
    }
    let expense = new Expense({
      expenseAmount,
      category,
      description,
      user: req.user,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    await expense.save();

    await req.user.addExpense(expense);

    //  leaderboard

    // let leaderBoard = await req.user.getLeaderBoard();
    // console.log("\n\n leaderboard=====> \n\n", leaderBoard, "\n\n");
    // if (!leaderBoard) {
    //   leaderBoard = await req.user.createLeaderBoard({
    //     userName: req.user.name,
    //   });
    // }

    // console.log("\n\n leaderboard=====> \n\n", leaderBoard, "\n\n");

    // let total = leaderBoard.totalExpenses + Number(expenseAmount);
    // leaderBoard.update({ totalExpenses: total });

    res
      .status(201)
      .json({ success: true, message: "Expense added successfully", expense });
  } catch (error) {
    console.log("\n \n", error, "\n");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getAllExpense = async (req, res, next) => {
  try {
    // let expenses = await Expense.findAll({ where: { userId: req.user.id } });

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit);

    if (limit > 20 || limit < 1 || !limit) limit = 5;

    // totalCount = await Expense.count({ where: { userId: req.user.id } });
    let totalCount = req.user.expenseDetails.expenses.length || 0;
    const lastPage = Math.ceil(totalCount / limit);

    const offset = (page - 1) * limit;

    let expenses = await Expense.find({ user: req.user._id })
      // .select("expenseAmount category description")
      .limit(limit)
      .skip(offset);

    if (expenses.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No Expense Found",
      });
    }

    let pagiInfo = {
      total: totalCount,
      hasNextPage: limit * page < totalCount,
      hasPrevPage: page > 1,
      nextPg: page + 1,
      prevPg: page - 1,
      lastPage: lastPage,
      limit,
    };

    res.status(200).json({
      success: true,
      message: "Found All Expenses",
      expenses,
      ...pagiInfo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete users expense
module.exports.deleteExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.expenseId;

    if (!expenseId) {
      return res.status(400).json({ success: false, message: "Bad Request" });
    }

    // delete expense

    let expense = await Expense.find({
      _id: expenseId,
      user: req.user._id,
    });

    if (!expense || expense.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Expense Does Not Belongs to User",
        error: " Unauthorized Request",
      });
    }

    // console.log("\n \n \n ", expense, "\n \n");

    // delete expense

    await Expense.findByIdAndDelete({ _id: expenseId });

    const oldExp = req.user.expenseDetails.expenses;

    const oldTotal = req.user.expenseDetails.total;

    const updatedExp = oldExp.filter(
      (expId) => expId.toString() !== expenseId.toString()
    );
    const newTotal = oldTotal - Number(expense[0].expenseAmount);

    await req.user.updateOne({
      expenseDetails: {
        total: newTotal,
        expenses: updatedExp,
      },
    });

    //  leaderboard

    // let leaderBoard = await req.user.getLeaderBoard();
    // if (!leaderBoard) {
    //   leaderBoard = await req.user.createLeaderBoard({
    //     userName: req.user.name,
    //   });
    // }

    // let total = leaderBoard.totalExpenses - Number(expense.expenseAmount);
    // leaderBoard.update({ totalExpenses: total });

    // await expense.destroy();
    res.json({ success: true, message: "Expense Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// //doenload expense
module.exports.downloadExpenseReport = async (req, res) => {
  try {
    console.log("\n\n download ============> \n\n\n");

    // get
    let expenses = await Expense.find({ user: req.user }).select(
      "_id expenseAmount category description createdAt updatedAt"
    );

    if (expenses.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No Expense Found",
      });
    }

    let csv = await convertFromJSON_to_CSV(expenses);
    //we are gonna send this csv to aws

    // console.log(csv);

    // UNCOMMENT 👇 to use aws
    /*
    let fileName = `Expense${req.user.id}/${new Date()}.csv`; // will creare folder --> ExpenseUSERID -->  filennameusingDate.csv
    // csv = JSON.stringify(csv);
    let fileUrl = await uploadToS3(csv, fileName); // data and filename

    // console.log("\n\n=================> url \n", fileUrl, "\n\n");

    if (!fileUrl) {
      return res
        .status(404)
        .json({ success: false, message: "Source Not Found" });
    }
    */

    let download = await new Download({
      type: "expenseReport",
      fileUrl: "https://picsum.photos/200/300", // replace with file url
      folder: `Expense${req.user.id}`,
      fileName: "test file", // replace with file name
      downloadedAt: new Date(),

      user: {
        userId: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    }).save();

    if (download) {
      res.status(200).json({
        success: true,
        fileName: download.fileName,
        fileUrl: download.fileUrl,
      });
    } else {
      throw Error("Cannot download file try again later");
    }
  } catch (error) {
    console.log("\n\n Err in download report \n ", error, "\n\n");
    res.status(500).json({ success: false, error });
  }
};

// get download history
module.exports.getExpenseReportDownloadHistory = async (req, res) => {
  try {
    let history = await Download.find({
      "user.userId": req.user._id,
      type: "expenseReport",
    }).select("-user -__v");

    console.log("\n\n\n download history =======> \n\n", history);

    if (!history || history.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No download history Found",
      });
    }

    // if history found then
    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
