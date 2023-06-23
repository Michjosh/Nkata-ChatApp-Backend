const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @description     Update user profile
// @route           PATCH /api/user/profile
// @access          Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  // Create an object to hold the fields that are not null
  const updateFields = {};

  // Check each field and add it to the updateFields object if it is not null
  if (name) {
    updateFields.name = name;
  }
  if (email) {
    updateFields.email = email;
  }
  if (password) {
    updateFields.password = password;
  }
  if (pic) {
    updateFields.pic = pic;
  }

  // Update the user profile with the non-null fields
  let user = await User.findByIdAndUpdate(req.user._id, updateFields, {
    new: true,
  });

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// @description     Update user password
// @route           PATCH /api/user/reset-password
// @access          Public
const resetPassword = asyncHandler(async (req, res) => {
  //find user
  const { email } = req.body;
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return res.status(401).json({
      message: `There is no user with ${req.body.email} email address.`,
    });
  }

  //encrypt new password
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(req.body.password, salt);

  //update and save new password
  let user = await User.findByIdAndUpdate(
    foundUser._id,
    { password: newPassword },
    { new: true }
  );

  //send response message
  if (user) {
    res.status(201).json({
      message: "Password changed Successsfully",
      token: generateToken(user._id),
    });
  } else {
    throw new Error("Password reset failed");
  }
});

module.exports = {
  allUsers,
  registerUser,
  login,
  updateUserProfile,
  resetPassword,
};
