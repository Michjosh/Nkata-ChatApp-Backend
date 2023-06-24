const mongoose = require("mongoose");
const UserVerificationData = mongoose.Schema({
  userId: { type: "String", required: true },
  name: { type: "String", required: true },
  uniqueString: { type: "String", unique: true, required: true },
  createdAt: Date,
  expiresAt: Date,
});

const UserVerification = mongoose.model("UserVerification", UserVerificationData);

module.exports = UserVerification;
