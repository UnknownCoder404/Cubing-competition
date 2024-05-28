const express = require("express");
const exceljs = require("exceljs");
const User = require("../../Models/user");
const verifyToken = require("../../middleware/verifyToken");
const cache = require("../../middleware/cache");
const hashPassword = require("../../functions/hashPassword");
const router = express.Router();
router.get("/", cache(30), verifyToken, async (req, res) => {
  if (req.userRole !== "admin") {
    return res
      .status(400)
      .send("Samo administratori smiju dobiti lozinke korisnika.");
  }
  try {
    // Fetch users from the database
    const users = await User.find({}, "username password");

    // Create a new workbook and add a sheet
    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet("Passwords");

    // Add column headers
    sheet.columns = [
      { header: "Korisnik", key: "username", width: 30 },
      { header: "Lozinka", key: "password", width: 30 },
    ];

    // Add rows to the sheet
    users.forEach(async (user) => {
      console.log(
        `Useranme ${user.username} with hashed password ${await hashPassword(
          user.password
        )}`
      );
      sheet.addRow({ username: user.username, password: user.password });
    });

    // Write to a file
    const fileName = "lozinke.xlsx";
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
    console.error(error);
    res.status(500).send("Pogreška prilikom izrade Excel datoteke.");
  }
});
module.exports = router;
