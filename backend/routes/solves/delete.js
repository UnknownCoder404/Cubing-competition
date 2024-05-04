const express = require("express");
const User = require("../../Models/user");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();
router.delete("/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId; // userid to delete solves
  const roundToDelete = req.body.round;
  const solveToDelete = req.body.solve;

  if (!roundToDelete) {
    res.status(400).json({ message: "Nedostaje runda za brisanje." });
  }
  if (typeof roundToDelete !== "number") {
    res.status(400).json({ message: "Runda za brisanje treba biti broj." });
  }
  if (typeof solveToDelete !== "number") {
    res.status(400).json({ message: "Slaganje za brisanje treba biti broj." });
  }

  const user = await User.findById(userId);

  // Delete the specified solve
  if (user.rounds && user.rounds[roundToDelete - 1]) {
    user.rounds[roundToDelete - 1].solves.splice(solveToDelete - 1, 1); // Remove the element at index
  } else {
    // Handle case where round doesn't exist
    return res
      .status(400)
      .json({ message: "Runda za korisnika nije pronađena." });
  }

  await user.save();
  return res.status(200).json({
    message: `Slaganje ${solveToDelete} u rundi ${roundToDelete} je uspješno izbrisano.`,
  });
});
module.exports = router;
