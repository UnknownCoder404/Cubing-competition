const express = require("express");
const User = require("../../Models/user");
const verifyToken = require("../../middleware/verifyToken");
const {
  checkUsernameAndPassword,
  checkUsernameLength,
  checkPasswordLength,
  checkUsernameAndPasswordEquality,
  checkGroup,
  checkPasswordSpaces,
} = require("../../functions/registerValidations");
const router = express.Router();
// Define a route for user registration
router.post("/", verifyToken, async (req, res) => {
  try {
    const { username, password, group } = req.body;
    const USER = await User.findById(req.userId);
    const userRole = USER.role;

    // Validate user role
    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Neovlašteno: samo administratori mogu registrirati korisnike",
      });
    }

    // Call validation functions
    checkUsernameAndPassword(username, password, res);
    checkUsernameLength(username, res);
    checkPasswordLength(password, res);
    checkUsernameAndPasswordEquality(username, password, res);
    checkGroup(group, res);
    checkPasswordSpaces(password, res);

    // If all validations pass, proceed with user registration
    const user = new User({ username, password, role: "user", group });
    await user.save();

    res.status(201).json({
      message: "Korisnik uspješno registriran.",
      registeredUser: {
        username,
        password,
        group,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      // 11000 duplicate error (mongoose)
      res.status(409).json({ message: "Korisničko ime već postoji." });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});
module.exports = router;
