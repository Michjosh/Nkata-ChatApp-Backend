const express = require("express");
const {
  registerUser,
  verify,
  login,
  allUsers,
  updateUserProfile,
  forgotPassword,
  resetPassword
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.route("/verify").get(verify);
router.route("/profile").patch(protect, updateUserProfile); 
router.route("/reset-password").patch(resetPassword)
router.route("/forgot-password").post(forgotPassword)
router.post("/login", login);

module.exports = router;
