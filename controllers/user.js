const User = require("../models/user");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.postSignUp = async (req, res, next) => {
  try {
    let name = req.body.userName;
    let email = req.body.email;
    let password = req.body.password;

    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw new Error("Something Went Wrong");

        const user = new User({
          name,
          email,
          password: hash,
        });

        user
          .save()
          .then((result) => {
            res
              .status(201)
              .json({ success: true, message: "SignUp successful" });
          })
          .catch((error) => {
            console.log(error);
            return res.status(409).json({
              success: false,
              error: error.message,
              message: " Email Already exist ",
            });
          });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.postSignIn = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    let user = await User.find({ email: email });

    if (user.length == 0) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    const hash = user[0].password;

    const { premium } = user[0];

    bcrypt.compare(password, hash, function (err, result) {
      // result == true

      if (err) throw new Error("Something Went Wrong !!!");
      if (result) {
        res.json({
          success: true,
          message: "Login successfull",
          Token: generateAccessToken(user[0].id, user[0].name),
          membership: premium,
        });
      } else {
        return res.status(401).json({
          success: false,
          error: "Wrong password",
          message: "User not authorized",
        });
      }
    });

    // console.log("\n \n \n");
    // console.log();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    // console.log("\n \n \n");

    // console.log(error);
  }
};

function generateAccessToken(id, name) {
  return jwt.sign(
    { userId: id, name: name },
    process.env.ACCESS_TOKEN_SECRET_KEY
  );
}
