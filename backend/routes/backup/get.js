// Route for getting backup
const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken");
const backupPath = "../../users-backup.json";
router.get("/download", verifyToken, async (req, res) => {
  if (req.userRole !== "admin") {
    return res.json({ message: "Samo administratori imaju pristup." });
  }
  if (await fs.readFile(path.join(__dirname, backupPath))) {
    return res.sendFile(path.join(__dirname, backupPath));
  } else {
    return res.json({ message: "Backup does not exist." });
  }
});
module.exports = router;
