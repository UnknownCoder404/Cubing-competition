const mongoose = require("mongoose");
const winnerSchema = new mongoose.Schema({
  group: { type: Number, enum: [1, 2], required: true }, // Only 1 winner per group
  id: { type: String, required: true },
});
const winner = mongoose.model("winners", winnerSchema);
module.exports = winner;
