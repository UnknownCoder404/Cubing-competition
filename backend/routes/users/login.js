const express = require("express");
const router = express.Router();
const User = require("../../Models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const loginLimiter = require("../../rateLimiter/login");
dotenv.config();

router.post("/", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate the input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Korisničko ime i lozinka su obavezni." });
    }

    // Find the user by username
    const user = await User.findOne({ username: { $eq: username } }).select(
      "+password"
    );
    const errorMessage = "Korisničko ime ili lozinka nisu ispravni.";

    // Check if the user exists and the password matches
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: errorMessage });
    }

    // Generate a JSON web token with the user id as the payload
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Korisnik se uspješno prijavio.",
      info: { id: user._id, token, username: username, role: user.role },
    });
  } catch (err) {
    // Log the error for internal debugging, but don't expose details to the client
    console.error(err);
    res.status(500).json({ message: "Došlo je do pogreške na poslužitelju." });
  }
});

module.exports = router;
