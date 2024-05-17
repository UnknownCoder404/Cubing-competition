const express = require("express");
const exceljs = require("exceljs");
const User = require("../../Models/user");
const verifyToken = require("../../middleware/verifyToken");
const cache = require("../../middleware/cache");
const formatTime = require("../../functions/formatTime");
const router = express.Router();
router.get("/", cache(30), verifyToken, async (req, res) => {
  if (req.userRole !== "admin") {
    return res.status(400).json({
      message: "Samo administratori smiju dobiti rezultate u excel formatu.",
    });
  }
  try {
    const results = await User.find({}, "username rounds group");
    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet("Rezultati");

    // Add column headers
    sheet.columns = [
      { header: "Natjecatelj", key: "username", width: 30 },
      { header: "Runda 1", key: "round1", width: 25 },
      { header: "Runda 2", key: "round2", width: 25 },
      { header: "Runda 3", key: "round3", width: 25 },
    ];

    // Add rows for each user
    results.forEach((user) => {
      // Create a row object with the username
      const row = { username: `${user.username} (Grupa ${user.group})` };

      // Assuming 'rounds' is an array of objects with a 'solves' property
      user.rounds.forEach((round, index) => {
        if (!round) return; // Sometimes round is null
        let solves = round.solves.slice(); // Create a copy
        if (!solves || solves.length === 0) return;
        solves.forEach((solve, index) => {
          console.log(solve);
          solves[index] = formatTime(solve);
        });
        // Add the solves to the corresponding round in the row object
        row[`round${index + 1}`] = solves.join(", ");
      });

      // Add the row to the sheet
      sheet.addRow(row);
    });
    // Auto size width of the column
    sheet.columns.forEach(function (column, i) {
      let maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });
    // Write to a file
    const fileName = "rezultati.xlsx";
    await workbook.xlsx.writeFile(fileName);

    // Set the headers to prompt download on the client side
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Pipe the workbook to the response
    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    console.error("Failed to generate results in excel format:");
    console.error(error);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
