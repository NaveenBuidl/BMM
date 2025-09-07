const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const EmailHelper = require("../util/EmailHelper");

function otpGenerator() {
  return Math.floor(Math.random() * 10000 + 90000);
}

const registerUser = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.send({
        success: false,
        message: "User Already Exists",
      });
    }

    // Hash the password before saving in DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const newUser = new User(req.body);
    await newUser.save();

    res.send({
      success: true,
      message: "Registration successful, Please login.",
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: "Something went wrong on server side.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.send({
        success: false,
        message: "User does not exist. Please register.",
      });
    }

    // Validate Password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.send({
        success: false,
        message: "Sorry, invalid password entered!",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.send({
      success: true,
      message: "You've successfully logged in!",
      data: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).select("-password");
    res.send({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

const forgetPassword = async (req, res) => {
  try {
    /**
     * 1. Extract email from request
     * 2. Check if mail is present in DB or not
     *  2.1: If email is not present -> send a response to the user (user not found)
     * 3. if email is present -> create basic otp using otpGenerator function and send to the email
     * 4. Also, store the otp -> in the userModel
     */

    if (req.body.email === undefined) {
      return res.status(401).json({
        success: false,
        message: "Please, enter the email for forget password",
      });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user === null) {
      return res.status(404).json({
        success: false,
        message: `user not found for ${req.body.email}`,
      });
    }

    // We got the user. Now, let's generate the OTP.
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // Now + 10 minutes
    await user.save();

    res.status(200).json({
      status: "success",
      message: `OTP send to the email: ${req.body.email}`,
    });

    // Send the email to their mailId
    await EmailHelper("otp.html", user.email, { name: user.name, otp: otp });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

const resetPassword = async (req, res) => {
  try {
    let resetDetails = req.body;
    if (!resetDetails.password || !resetDetails.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const user = await User.findOne({ otp: resetDetails.otp });
    if (user === null) {
      return res.status(404).json({
        success: false,
        message: `user not found`,
      });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(401).json({
        success: false,
        message: "OTP Expired",
      });
    }

    // Hash the password before saving in DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(resetDetails.password, salt);
    resetDetails.password = hashedPassword;

    user.password = resetDetails.password;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset was successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  forgetPassword,
  resetPassword,
};
