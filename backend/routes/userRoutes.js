const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateUserProfile, // New endpoint
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.route("/profile").put(protect, updateUserProfile); // New endpoint
router.post("/login", authUser);

module.exports = router;
