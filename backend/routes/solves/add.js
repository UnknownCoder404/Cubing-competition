const express = require("express");
const User = require("../../Models/user");
const verifyToken = require("../../middleware/verifyToken");
const addSolves = require("../../functions/addSolves");
const { getUserById } = require("../../functions/getUserById");
const router = express.Router();
router.post("/:solverId", verifyToken, async (req, res) => {
  try {
    const solverId = req.params.solverId;
    const solver = await getUserById(solverId);
    const judgeId = req.userId;
    const judgeRole = req.userRole;
    const solves = req.body.solves;
    const round = req.body.round - 1; // indexing starts at 0
    if (judgeRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Samo administratori mogu dodavati slaganja." });
    }
    if (!solver) {
      return res.status(400).json({
        message: `Natjecatelj ne postoji. Kontaktirajte programere za pomoć. (Naveli ste: ${solverId})`,
      });
    }
    if (!solves) {
      return res.status(400).json({ message: "Nema ponuđenih slaganja." });
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
    const response = await addSolves(solver, solves, round);
    if (response > 0) {
      return res
        .status(200)
        .json({ message: `Slaganje dodano korisniku ${solver.username}.` });
    }
    throw new Error("Nije uspjelo dodavanje slaganja.");
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Neuspjelo dodavanje slaganja. Greška u serveru." });
  }
});
module.exports = router;
