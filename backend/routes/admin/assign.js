const express = require("express");
const User = require("../../Models/user");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();
router.post("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      res.status(403).json({
        message: "Samo administratori mogu dodijeliti administratore.",
      });
      return;
    }
    const userId = req.params.userId;
    const user = await User.findOne({ _id: { $eq: userId } });
    if (!user) {
      res.status(404).json({ message: "Korisnik nije pronađen." });
      return;
    }
    if (user.role === "admin") {
      res.status(409).json({ message: "Korisnik je već administrator." });
      return;
    }
    user.role = "admin";
    await user.save();
    res
      .status(200)
      .json({ message: "Uloga administratora uspješno je dodijeljena." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri serveru." });
  }
});
module.exports = router;
