const express = require("express");
const {
  registerUser,
  login,
  allUsers,
  updateUserProfile,
  resetPassword
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.route("/profile").patch(protect, updateUserProfile); 
router.route("/reset-password").patch(protect, resetPassword)
router.post("/login", login);

module.exports = router;
