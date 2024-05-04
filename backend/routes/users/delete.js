const express = require("express");
const User = require("../../Models/user");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();
router.delete("/:userId", verifyToken, (req, res) => {
  if (req.userRole !== "admin") {
    res
      .status(403)
      .json({ message: "Samo administratori mogu brisati korisnike." });
  }

  const userId = req.params.userId;

  // Delete user using mongoose
  User.findByIdAndDelete(userId)
    .then(() =>
      res.status(200).json({ message: "Korisnik je uspješno izbrisan." })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Greška prilikom brisanja korisnika.", error: err })
    );
});
module.exports = router;
