// Require the necessary modules
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
// Load the environment variables from the .env file
dotenv.config();

// Create an express app
const app = express();

// Use JSON middleware to parse the request body
app.use(express.json());
// Use cors middleware
app.use(cors());
// Connect to the MongoDB database using mongoose

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Define a schema for the user model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "user"] },
});

const addSolves = async (userId, solves) => {
  // Validation logic here (same as the original method)
  if (!Array.isArray(solves) || solves.length !== 5) {
    throw new Error("Invalid solves data. Must be an array of 5 times.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if 'rounds' array is undefined before using push
  if (!user.rounds) {
    user.rounds = []; // Initialize rounds array if it doesn't exist
  }

  user.rounds.push(...solves.map((time) => ({ time })));
  await user.save();
};
// Add a pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    // Call the next middleware
    next();
  } catch (err) {
    // Handle the error
    next(err);
  }
});

// Define a middleware to verify the token
const verifyToken = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.headers["authorization"];
    // Check if the token exists
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    // Verify the token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Set the user id to the request object
    req.userId = decoded.id;
    const USER = await User.findById(decoded.id);
    req.userRole = USER.role;
    // Call the next middleware
    next();
  } catch (err) {
    // Handle the error
    res.status(401).json({ message: "Invalid token" });
  }
};

// Add a method to compare the password with the hashed one
userSchema.methods.comparePassword = async function (password) {
  try {
    // Return a boolean value indicating the match
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    // Handle the error
    throw err;
  }
};

// Create a user model from the schema
const User = mongoose.model("User", userSchema);
const registerAdmin = async () => {
  // Create a new user instance
  const user = new User({
    username: "admin",
    password: "admin",
    role: "admin",
  });
  // Save the user to the database
  await user.save();
};
//registerAdmin();
// Define a route for user registration
app.post("/register", verifyToken, async (req, res) => {
  try {
    // Get the username and password from the request body
    const { username, password } = req.body;
    const USER = await User.findById(req.userId);
    const userRole = USER.role;
    // Validate the input
    if (userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only admins can register users" });
    }
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }
    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username must be longer than 3 characters." });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be longer than 7 characters." });
    }
    if (username === password) {
      return res
        .status(400)
        .json({ message: "Username and password cannot be same." });
    }
    // Create a new user instance
    const user = new User({ username, password, role: "user" }); // Set default role to 'user'
    // Save the user to the database
    await user.save();
    // Send a success response
    console.log(`User registered with username: "${req.body.username}"`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    // Handle the error
    if (err.code === 11000) {
      // Duplicate username
      res.status(409).json({ message: "Username already exists." });
    } else {
      // Other errors
      res.status(500).json({ message: err.message });
    }
  }
});

// Define a route for user login
app.post("/login", async (req, res) => {
  try {
    // Get the username and password from the request body
    const { username, password } = req.body;
    // Validate the input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    // Find the user by username
    const user = await User.findOne({ username });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Compare the password with the hashed one
    const match = await user.comparePassword(password);
    // Check if the password matches
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Generate a JSON web token with the user id as the payload
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    res.status(200).json({
      message: "User logged in successfully",
      info: { id: user._id, token },
    });
  } catch (err) {
    // Handle the error
    res.status(500).json({ message: err.message });
  }
});

// Define a route for testing the authentication
app.get("/test", verifyToken, (req, res) => {
  // Send a success response with the user id
  res
    .status(200)
    .json({ message: "You are authenticated", userId: req.userId });
});

// PROFILE INFO
// Define a route for getting the user profile (by id)
app.get("/profile", verifyToken, async (req, res) => {
  try {
    // Find the user by id using the user model
    const user = await User.findById(req.userId);
    if (req.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can get profile info." });
    }
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Send a success response with the user profile
    res
      .status(200)
      .json({ message: "User profile retrieved successfully", user });
  } catch (err) {
    // Handle the error
    res.status(500).json({ message: err.message });
  }
});

app.post("/assign-admin/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.role === "admin") {
      res.status(409).json({ message: "User is already an admin." });
      return;
    }
    if (req.userRole !== "admin") {
      res.status(403).json({ message: "Only admins can assign admins" });
      return;
    }

    user.role = "admin";
    await user.save();
    res.status(200).json({ message: "Admin role assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Start the server on the specified port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
