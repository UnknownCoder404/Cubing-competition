const express = require("express");
const User = require("../../Models/user");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();
router.post("/change-password", verifyToken, async (req, res) => {
  try {
    // Ensure only admins can access this route
    if (req.userRole !== "admin") {
      return res.status(401).json({
        message: "Samo administratori mogu mijenjati lozinke korisnika.",
      });
    }
    const username = req.body.username; // Username of user to change password
    const newPassword = req.body.newPassword;
    console.log(`Username: ${username}`);
    console.log(`New password: ${newPassword}`);
    if (!username || typeof username !== "string") {
      return res.status(400).json({
        message: "Korisničko ime je krivo uneseno ili nedostaje.",
      });
    }
    if (!newPassword | (typeof newPassword !== "string")) {
      return res.status(400).json({
        message: "Nova lozinka je krivo unesena ili nedostaje.",
      });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: `Korisnik sa imenom ${username} ne postoji.`,
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Lozinka promijenjena." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Greška kod servera." });
  }
});
module.exports = router;
