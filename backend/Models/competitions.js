const mongoose = require("mongoose");

const allowedEvents = ["3x3", "3x3oh", "4x4", "2x2"];
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, enum: allowedEvents },
  rounds: { type: Number, required: true },
  solvers: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
});

const competitionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  events: [eventSchema],
});
const competition = mongoose.model("competitions", competitionSchema);

module.exports = competition;
