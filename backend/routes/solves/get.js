const express = require("express");
const User = require("../../Models/user");
const cache = require("../../middleware/cache");
const router = express.Router();
// Route handler for getting live solves
router.get("/", cache(300), async (req, res) => {
  try {
    const usersWithSolves = await User.find({
      rounds: {
        $elemMatch: {
          index: { $eq: req.query.index },
          solves: { $exists: true, $not: { $size: 0 } },
        },
      },
    }).select("username rounds group -_id");
    res.json({
      solves: usersWithSolves,
      lastUpdated: new Intl.DateTimeFormat("en-US", {
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date()),
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving solves" });
  }
});
module.exports = router;
