const express = require("express");
const User = require("../Models/user");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
// Define a route for user registration
router.post("/register", verifyToken, async (req, res) => {
  try {
    // Get the username and password from the request body
    const { username, password, group } = req.body;
    const USER = await User.findById(req.userId);
    const userRole = USER.role;
    // Validate the input
    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Neovlašteno: samo administratori mogu registrirati korisnike",
      });
    }
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Korisničko ime i lozinka su obavezni." });
    }
    if (username.length < 5) {
      return res
        .status(400)
        .json({ message: "Korisničko ime mora biti duže od 4 znaka." });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Lozinka mora biti duža od 7 znakova." });
    }
    if (username === password) {
      return res
        .status(400)
        .json({ message: "Korisničko ime i lozinka ne mogu biti isti." });
    }
    if (group !== 1 && group !== 2) {
      return res.status(400).json({ message: "Grupa mora biti 1 ili 2." });
    }
    if (password.split("").includes(" ")) {
      return res
        .status(400)
        .json({ message: "Lozinka ne smije koristiti razmak." });
    }
    // Create a new user instance
    const user = new User({ username, password, role: "user", group }); // Set default role to 'user'
    // Save the user to the database
    await user.save();
    res.status(201).json({
      message: "Korisnik  uspješno registriran.",
      registeredUser: {
        username,
        password,
        group,
      },
    });
  } catch (err) {
    // Handle the error
    if (err.code === 11000) {
      // Duplicate username
      res.status(409).json({ message: "Korisničko ime već postoji." });
    } else {
      // Other errors
      res.status(500).json({ message: err.message });
    }
  }
});
module.exports = router;
