const express = require("express");
const User = require("../../Models/user");
const verifyToken = require("../../middleware/verifyToken");
const hashPassword = require("../../functions/hashPassword");
const router = express.Router();
const {
  checkUsernameAndPassword,
  checkPasswordLength,
  checkUsernameAndPasswordEquality,
  checkPasswordSpaces,
} = require("../../functions/registerValidations");
router.post("/change-password", verifyToken, async (req, res) => {
  try {
    // Ensure only admins can access this route
    if (req.userRole !== "admin") {
      return res.status(401).json({
        message: "Samo administratori mogu mijenjati lozinke korisnika.",
      });
    }
    const { username, newPassword } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: `Korisnik sa imenom ${username} ne postoji.`,
      });
    }
    checkUsernameAndPassword(user.username, newPassword, res);
    checkUsernameAndPasswordEquality(user.username, newPassword, res);
    checkPasswordLength(newPassword, res);
    checkPasswordSpaces(newPassword, res);
    user.password = await hashPassword(newPassword);
    await user.save();
    return res.status(200).json({ message: "Lozinka promijenjena." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Greška kod servera." });
  }
});
module.exports = router;
