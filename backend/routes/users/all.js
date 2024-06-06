const express = require("express");
const User = require("../../Models/user");
const verifyToken = require("../../middleware/verifyToken");
const isAdmin = require("../../utils/helpers/isAdmin");
const router = express.Router();
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}, "username role rounds group");

    // Prepare the response array
    const usersInfo = users.map((user) => ({
      id: user._id,
      username: user.username,
      role: user.role,
      rounds: user.rounds,
      group: user.group,
    }));

    // Send the response array
    res.status(200).json(usersInfo);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
