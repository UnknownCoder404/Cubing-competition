// Route for getting backup
const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken");
const isAdmin = require("../../utils/helpers/isAdmin");
const backupPath = path.join(__dirname, "../../users-backup.json");
router.get("/download", verifyToken, isAdmin, async (req, res) => {
  if (await fs.readFile(backupPath)) {
    return res.sendFile(backupPath);
  }
  return res.status(404).json({ message: "Backup does not exist." });
});
module.exports = router;
