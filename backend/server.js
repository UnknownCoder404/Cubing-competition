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
  .catch((err) => console.error("Failed to connect to MongoDB: \n" + err));

const solveSchema = new mongoose.Schema({ solves: [Number] });
// Define a schema for the user model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "user"] },
  rounds: [solveSchema],
});

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
    req.user = USER;
    req.userRole = USER.role;
    // Call the next middleware
    next();
  } catch (err) {
    // Handle the error
    res.status(401).json({ message: "Invalid token. Try logging in again." });
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
    res.status(201).json({
      message: "User registered successfully",
      registeredUser: {
        username: req.body.username,
        password: req.body.password,
      },
    });
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
async function createAdmin(username, password) {
  // -1 : Username missing
  // -2 : Password missing
  // -3 : Username taken
  // -4 : Error while saving admin to database
  //  1 : Success
  if (!username) {
    return -1;
  }
  if (!password) {
    return -2;
  }
  const available = !(await User.findOne({ username }));

  if (!available) {
    console.error("Tried to create admin with username that already exists.");
    return -3;
  }
  // Create a new user instance
  const user = new User({
    username,
    password,
    role: "admin",
  });
  // Save the user to the database
  try {
    await user.save();
    return 1;
  } catch (err) {
    console.error(`Error while saving new Admin:\n` + err);
    return -4;
  }
}
// Define a route for user login
app.post("/login", async (req, res) => {
  try {
    // Get the username and password from the request body
    const username = req.body.username;
    const password = req.body.password;
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
      expiresIn: "24h",
    });
    res.status(200).json({
      message: "User logged in successfully",
      info: { id: user._id, token, username: username, role: user.role },
    });
  } catch (err) {
    // Handle the error
    res.status(500).json({ message: err.message });
  }
});

app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findbyId(req.userId);
    return res
      .status(200)
      .json({ userId: req.userId, username: user.username, role: user.role });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

app.delete("/users/delete/:userId", verifyToken, (req, res) => {
  if (req.userRole !== "admin") {
    res.status(403).json({ message: "Only admins can delete users." });
  }

  const userId = req.params.userId;

  // Delete user using mongoose
  User.findByIdAndDelete(userId)
    .then(() => res.status(200).json({ message: "User deleted successfully." }))
    .catch((err) =>
      res.status(500).json({ message: "Error deleting user.", error: err })
    );
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

app.post("/solves/add/:solverId", verifyToken, async (req, res) => {
  const solverId = req.params.solverId;
  const solver = await User.findById(solverId);
  const judgeId = req.userId;
  const judgeRole = req.userRole;
  const solves = req.body.solves;
  const round = req.body.round - 1; // indexing starts at 0
  if (judgeRole !== "admin") {
    return res.status(403).json({ message: "Only Admins can add solves." });
  }
  if (!solver) {
    return res.status(400).json({
      message: `Solver doesn't exist. Contact administrators for help. (You provided: ${solverId})`,
    });
  }
  console.log(`Solves: ${solves}`);
  if (!solves) {
    return res.status(400).json({ message: "No solves provided." });
  }
  const response = await addSolves(solver, solves, round);
  if (response > 0) {
    return res
      .status(200)
      .json({ message: `Solves added to ${solver.username}.` });
  } else {
    return res.status(400).json({
      message: `Failed to add solves to ${solver.username}. Contact administrators for help.`,
    });
  }
});

async function addSolves(solver, solves, round) {
  // Input validation
  if (!solver || !solves || typeof round !== "number") {
    return -1;
  }

  // Ensure rounds array exists
  if (!solver.rounds) {
    solver.rounds = [];
  }

  // Check if the round needs to be created
  if (round >= solver.rounds.length) {
    // Create new rounds to fill the gap
    solver.rounds.length = round + 1;
    // Initialize the new round with an empty solves array
    solver.rounds[round] = { solves: [] };
  }

  try {
    // Update the solves array for the specified round
    solver.rounds[round].solves.push(...solves);

    // Save the updated user data
    await solver.save();

    // Success response
    return 1;
  } catch (err) {
    console.error("Error adding solves:", err);
    return -1;
  }
}

app.delete("/solves/delete/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId; // userid to delete solves
  const roundToDelete = req.body.round;
  const solveToDelete = req.body.solve;

  if (!roundToDelete) {
    res.status(400).json({ message: "Round to delete is missing." });
  }
  if (typeof roundToDelete !== "number") {
    res.status(400).json({ message: "Round to delete should be a number." });
  }

  if (typeof solveToDelete !== "number") {
    res.status(400).json({ message: "Solve to delete should be a number." });
  }

  const user = await User.findById(userId);

  // Delete the specified solve
  if (user.rounds && user.rounds[roundToDelete - 1]) {
    user.rounds[roundToDelete - 1].solves.splice(solveToDelete - 1, 1); // Remove the element at index
  } else {
    // Handle case where round doesn't exist
    return res.status(400).json({ message: "Round not found for user." });
  }

  await user.save();
  return res.status(200).json({
    message: `Successfully deleted solve ${solveToDelete} in round ${roundToDelete}.`,
  });
});

app.post("/admin/register", verifyToken, async (req, res) => {
  const adminUsername = req.body.username;
  const adminPassword = req.body.password;

  if (req.userRole !== "admin") {
    return res
      .status(401)
      .json({ message: "Only admins can register admins." });
  }

  // -1 : Username missing
  // -2 : Password missing
  // -3 : Username taken
  // -4 : Error while saving admin to database
  //  1 : Success
  const result = await createAdmin(adminUsername, adminPassword);
  if (result === 1) {
    return res.status(200).json({ message: "Successfully registered admin." });
  }
  if (result === -1) {
    return res.status(400).json({ message: "Username missing." });
  }
  if (result === -2) {
    return res.status(400).json({ message: "Password missing." });
  }
  if (result === -3) {
    return res.status(400).json({
      message: `Cannot register admin with username ${adminUsername}. Username already taken.`,
    });
  }
  if (result === -4) {
    return res
      .status(500)
      .json({ message: "Error while saving admin to database." });
  }

  console.error(`Error registering new admin. Deep logs:
Old Admin userRole: "${req.userRole}", 
Old Admin id: "${req.userId}",
Old Admin username: "${req.user.username}"
New Admin username: "${adminUsername}",
New Admin password: "${adminPassword}",
Result: "${result}"
  `);
  return res.status(500).json({
    message: "Unknown result. Contact admins and tell them to check logs.",
  });
});

app.get("/users/all", verifyToken, async (req, res) => {
  try {
    // Ensure only admins can access this route
    if (req.userRole !== "admin") {
      return res
        .status(401)
        .json({ message: "Only admins can get users info." });
    }

    // Fetch all users from the database
    const users = await User.find({}, "username role rounds");

    // Prepare the response array
    const usersInfo = users.map((user) => ({
      id: user._id,
      username: user.username,
      role: user.role,
      rounds: user.rounds,
    }));

    // Send the response array
    res.status(200).json(usersInfo);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});

app.delete("/users/:userId", verifyToken, async (req, res) => {
  try {
    // Ensure only admins can access this route
    if (req.userRole !== "admin") {
      return res.status(401).json({ message: "Only admins can delete users." });
    }

    const userId = req.params.userId; // Id of user to delete

    // Delete user with this id.
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: error.message });
  }
});

// Start the server on the specified port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
createAdmin("admin", "admin");
