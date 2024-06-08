const express = require("express");
const User = require("../../Models/user");
const cache = require("../../middleware/cache");
const router = express.Router();
// Route handler for getting live solves
router.get("/", cache(5), async (req, res) => {
  try {
    const usersWithSolves = await User.find({
      rounds: {
        $elemMatch: {
          index: { $eq: req.query.index },
          solves: { $exists: true, $not: { $size: 0 } },
        },
      },
    }).select("username rounds group -_id");
    res.status(200).json({
      solves: usersWithSolves,
      lastUpdated: new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date()),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving solves" });
  }
});
module.exports = router;
