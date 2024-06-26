const Competition = require("../../Models/competitions");
const express = require("express");
const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const competitions = await Competition.find({}).select("-_id");
    return res.status(200).json(competitions);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Greška prilikom dohvaćanja natjecanja." });
  }
});
module.exports = router;
