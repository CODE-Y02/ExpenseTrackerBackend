const dotenv = require("dotenv");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");

const compression = require("compression");

const bodyParser = require("body-parser");

dotenv.config();

// const privateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");

const app = express();

const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

// import routes
const userRoutes = require("./routes/user");
const expenseRouter = require("./routes/expense");
const paymentRouter = require("./routes/payment");
const passwordRoute = require("./routes/password");
const leaderBoardRoute = require("./routes/leaderboard");

// log
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(helmet()); // settion response headers
app.use(compression()); // compress response
app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/expense", expenseRouter);
app.use("/payment", paymentRouter);

app.use("/password", passwordRoute);
app.use("/leaderboard", leaderBoardRoute);

app.use("/", (req, res) => {
  res.status(404).json({ success: false, message: "Page Not Found " });
});

// /expense-report/-->  download --> get all expense of user and download them as list

const startApp = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MongoUser}:${process.env.MongoPass}@${process.env.MongoCluster}.cko8cat.mongodb.net/${process.env.MongoDataBase}?retryWrites=true&w=majority`
    );

    // ssl
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 3000, () => {
    //     console.log(
    //       `  \n\n\n  Server running on port ==== > ${
    //         process.env.PORT || 3000
    //       } \n\n`
    //     );
    //   });

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `\n\n expenseTracker server is running at  ${
          process.env.PORT || 3000
        } PORT \n\n`
      );
    }); // NO ssl
  } catch (error) {
    console.log("\n \n \n \n ");
    console.log({ errorMsg: error.message, error });
    console.log("\n \n \n \n ");
  }
};

startApp();
