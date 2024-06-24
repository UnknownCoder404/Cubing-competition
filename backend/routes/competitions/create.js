const express = require("express");
const router = express.Router();
const competition = require("../../Models/competitions");
const isAdmin = require("../../utils/helpers/isAdmin");
const verifyToken = require("../../middleware/verifyToken");
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  const { events, name, date } = req.body;
  console.log(events, name, date);
  if (!events || !name || !date) {
    return res
      .status(400)
      .json({ message: "Eventovi, ime i datum su obavezni." });
  }
  events.forEach((event, index) => {
    if (!event.name || !event.rounds) {
      return res
        .status(400)
        .json({ message: `Ime i broj runda su obavezni. (#${index + 1})` });
    }
  });
  // event.solvers can be undefined, that means that solvers will be empty array
  const newCompetitionEvents = events.map((event) => {
    return {
      name: event.name,
      rounds: event.rounds,
      solvers: event.solvers || [],
    };
  });
  try {
    const newCompetition = new competition({
      name: name,
      events: newCompetitionEvents,
      date: date,
    });
    await newCompetition.save();
    return res.status(200).json({ message: "Natjecanje napravljeno." });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Ime natjecanja je već korišteno." });
    }
    console.error(error);
    return res
      .status(500)
      .json({ message: "Greška prilikom izrade natjecanja." });
  }
});
module.exports = router;
