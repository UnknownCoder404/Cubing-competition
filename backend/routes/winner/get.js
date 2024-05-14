const express = require("express");
const User = require("../../Models/user");
const winner = require("../../Models/winner");
const router = express.Router();
router.get("/get", async (req, res) => {
  try {
    const winners = await winner.find({}, "id group");
    for (let index = 0; index < winners.length; index++) {
      const user = await User.findById(winners[index].id);
      winners[index].username = user ? user.username : "Nepoznato";
    }
    // Construct response object with usernames
    const response = winners.map((winner) => ({
      id: winner.id,
      group: winner.group,
      username: winner.username,
    }));
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Greška unutar servera." });
  }
});
module.exports = router;
