const express = require("express");
const User = require("../../Models/user");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();
router.delete("/users/:userId", verifyToken, async (req, res) => {
  try {
    // Ensure only admins can access this route
    if (req.userRole !== "admin") {
      return res
        .status(401)
        .json({ message: "Samo administratori mogu brisati korisnike." });
    }

    const userId = req.params.userId; // Id of user to delete

    // Delete user with this id.
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    return res.status(200).json({ message: "Korisnik je uspješno izbrisan." });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: error.message });
  }
});
module.exports = router;
