const express = require("express");
const User = require("../../Models/user");
const winner = require("../../Models/winner");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();
router.post("/announce", verifyToken, async (req, res) => {
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
      // Koristite _id za brisanje dokumenta pobjednika
      await winner.findByIdAndDelete(existingWinner._id);
      return res.status(200).json({ message: "Pobjednik uspješno izbrisan." });
    }
    if (existingWinner) {
      // Ako već postoji pobjednik, ažurirajte ID pobjednika
      existingWinner.id = id;
      await existingWinner.save();
      return res
        .status(200)
        .json({ message: "Pobjednik uspješno promijenjen." });
    }

    // Stvorite novog pobjednika
    const newWinner = new winner({ group, id });
    // Spremite pobjednika u bazu podataka
    await newWinner.save();
    res.status(201).json({ message: "Pobjednik uspješno objavljen." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška kod servera." });
  }
});
module.exports = router;
