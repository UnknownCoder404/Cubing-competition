const express = require("express");
const User = require("../../Models/user");
const winner = require("../../Models/winner");
const verifyToken = require("../../middleware/verifyToken");
const isAdmin = require("../../utils/helpers/isAdmin");
const router = express.Router();
router.post("/announce", verifyToken, isAdmin, async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res.status(400).json({ message: "Id korisnika je potreban." });
    }
    const user = await User.findOne({ _id: { $eq: id } });
    if (!user) {
      return res.status(400).json({ message: "Korisnik ne postoji." });
    }
    const group = user.group;
    // Provjerite postoji li već pobjednik za grupu
    let existingWinner = await winner.findOne({ group });
    if (existingWinner && existingWinner.id === id) {
      // If winner exists in the same group, and the existing winner has the same id, then delete the existing winner
      await winner.findByIdAndDelete(existingWinner._id);
      return res.status(200).json({ message: "Pobjednik uspješno izbrisan." });
    }
    if (existingWinner) {
      // If winner exists in the same group, but the existing winner has a different id, then update the existing winner
      existingWinner.id = id;
      await existingWinner.save();
      return res
        .status(200)
        .json({ message: "Pobjednik uspješno promijenjen." });
    }

    // No winner exists in the same group, create a new winner
    const newWinner = new winner({ group, id });
    await newWinner.save();
    res.status(201).json({ message: "Pobjednik uspješno objavljen." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška kod servera." });
  }
});
module.exports = router;
