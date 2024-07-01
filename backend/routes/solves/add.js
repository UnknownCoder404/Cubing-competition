const express = require("express");
const mongoose = require("mongoose");
const Competition = require("../../Models/competitions");
const verifyToken = require("../../middleware/verifyToken");
const updateSolves = require("../../functions/addSolves");
const { getUserById } = require("../../functions/getUserById");
const isAdmin = require("../../utils/helpers/isAdmin");
const router = express.Router();
router.post("/:solverId", verifyToken, isAdmin, async (req, res) => {
  try {
    const solverId = req.params.solverId;
    const solver = await getUserById(solverId);
    const judgeId = req.userId;
    const { solves, round, competitionId } = req.body;
    if (!solver) {
      return res.status(400).json({
        message: `Natjecatelj ne postoji. Kontaktirajte programere za pomoć. (Naveli ste: ${solverId})`,
      });
    }
    if (!solves) {
      return res.status(400).json({ message: "Nema ponuđenih slaganja." });
    }
    if (!competitionId) {
      return res.status(400).json({ message: "Nema ID natjecanja." });
    }
    // Validate competitionId
    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      return res.status(400).json({ message: "ID natjecanja nije ispravan." });
    }

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return res
        .status(400)
        .json({ message: `Natjecanje ne postoji. (Id: ${competitionId})` });
    }
    for (let i = 0; i < solves.length; i++) {
      if (solves !== 0 && !solves[i]) {
        return res.status(400).json({ message: `Slaganje ne postoji.` });
      }
      if (solves[i] < 0) {
        return res
          .status(400)
          .json({ message: `Slaganje #${i + 1} je negativno.` });
      }
    }
    const response = await updateSolves(solver, solves, round, competition);
    if (response > 0) {
      return res
        .status(200)
        .json({ message: `Slaganje dodano korisniku ${solver.username}.` });
    }
    throw new Error(`Nije uspjelo dodavanje slaganja. Kod greške: ${response}`);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Neuspjelo dodavanje slaganja. Greška u serveru." });
  }
});
module.exports = router;
