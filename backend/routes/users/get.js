const express = require("express");
const User = require("../../Models/user");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();
router.get("/users/:userId", verifyToken, async (req, res) => {
  try {
    // Ensure only admins can access this route
    if (req.userRole !== "admin") {
      return res.status(401).json({
        message: "Samo administratori mogu dobiti informacije o korisnicima.",
      });
    }

    // Fetch all users from the database
    const user = await User.findById(req.params.userId, "username role rounds");

    // Send the response array
    res.status(200).json(user);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
