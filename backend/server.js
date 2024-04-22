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
// Define the list of allowed origins
const allowedOrigins = [
  "http://localhost:2500",
  "http://127.0.0.1:2500",
  "https://unknowncoder404.github.io",
];

// CORS middleware function to check the origin against the allowed list
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
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
  group: { type: String, required: true },
});
// Define the schema for the Post model
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Post model using the schema
const Post = mongoose.model("Post", postSchema);

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
      return res
        .status(403)
        .json({ message: "Nema tokena. Prijavi se ponovno." });
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
    res
      .status(401)
      .json({ message: "Pogrešan token. Pokušajte se ponovno prijaviti." });
  }
};

// Add a method to compare the password with the hashed one
userSchema.methods.comparePassword = async function (password) {
  try {
    // Return a boolean value indicating the match
    console.log(`Username: ${this.username}`);
    console.log("Plain password:", password);
    console.log("Hashed password:", this.password);
    console.log(
      await bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) throw err;
        // isMatch is true if the passwords match, or false if they don't
      })
    );
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
    // Create a new user instance
    const user = new User({ username, password, role: "user", group }); // Set default role to 'user'
    // Save the user to the database
    await user.save();
    // Send a success response
    console.log(`Korisnik registriran s korisničkim imenom: "${username}"`);
    console.log(`Korisnik registriran sa lozinkom: "${password}"`);
    console.log(`Korisnik registriran u grupi: ${group}`);
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
    console.error(
      "Pokušao stvoriti administratora s korisničkim imenom koje već postoji."
    );
    return -3;
  }
  // Create a new user instance
  const user = new User({
    username,
    password,
    role: "admin",
    group: 1,
  });
  // Save the user to the database
  try {
    await user.save();
    return 1;
  } catch (err) {
    console.error(`Greška prilikom spremanja novog administratora:\n` + err);
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
        .json({ message: "Korisničko ime i lozinka su obavezni." });
    }
    // Find the user by username
    const user = await User.findOne({ username });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "Korisnik ne postoji." });
    }
    // Compare the password with the hashed one
    const match = await user.comparePassword(password);
    // Check if the password matches
    if (!match) {
      return res.status(401).json({ message: "Netočna lozinka." });
    }
    // Generate a JSON web token with the user id as the payload
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({
      message: "Korisnik se uspješno prijavio.",
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
    res
      .status(403)
      .json({ message: "Samo administratori mogu brisati korisnike." });
  }

  const userId = req.params.userId;

  // Delete user using mongoose
  User.findByIdAndDelete(userId)
    .then(() =>
      res.status(200).json({ message: "Korisnik je uspješno izbrisan." })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Greška prilikom brisanja korisnika.", error: err })
    );
});
app.post("/assign-admin/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Korisnik nije pronađen." });
      return;
    }
    if (user.role === "admin") {
      res.status(409).json({ message: "Korisnik je već administrator." });
      return;
    }
    if (req.userRole !== "admin") {
      res.status(403).json({
        message: "Samo administratori mogu dodijeliti administratore.",
      });
      return;
    }

    user.role = "admin";
    await user.save();
    res
      .status(200)
      .json({ message: "Uloga administratora uspješno je dodijeljena." });
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
    return res
      .status(403)
      .json({ message: "Samo administratori mogu dodavati slaganja." });
  }
  if (!solver) {
    return res.status(400).json({
      message: `Natjecatelj ne postoji. Kontaktirajte programere za pomoć. (Naveli ste: ${solverId})`,
    });
  }
  if (!solves) {
    return res.status(400).json({ message: "Nema ponuđenih slaganja." });
  }
  for (let i = 0; i < solves.length; i++) {
    if (solves[i] < 0) {
      return res
        .status(400)
        .json({ message: `Slaganje #${i + 1} je negativno.` });
    }
  }
  const response = await addSolves(solver, solves, round);
  if (response > 0) {
    return res
      .status(200)
      .json({ message: `Slaganje dodano korisniku ${solver.username}.` });
  } else {
    return res.status(400).json({
      message: `Nije uspjelo dodavanje slaganja korisniku ${solver.username}. Kontaktirajte programere za pomoć.`,
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
    if (!solver.rounds[round]) {
      solver.rounds[round] = { solves: [] };
    }
    if (!solver.rounds[round].solves) {
      solver.rounds[round].solves = [];
    }
    solver.rounds[round].solves.push(...solves);

    // Save the updated user data
    await solver.save();

    // Success response
    return 1;
  } catch (err) {
    console.error("Pogreška dodavanja slaganja:\n", err);
    return -1;
  }
}

app.delete("/solves/delete/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId; // userid to delete solves
  const roundToDelete = req.body.round;
  const solveToDelete = req.body.solve;

  if (!roundToDelete) {
    res.status(400).json({ message: "Nedostaje runda za brisanje." });
  }
  if (typeof roundToDelete !== "number") {
    res.status(400).json({ message: "Runda za brisanje treba biti broj." });
  }

  if (typeof solveToDelete !== "number") {
    res.status(400).json({ message: "Slaganje za brisanje treba biti broj." });
  }

  const user = await User.findById(userId);

  // Delete the specified solve
  if (user.rounds && user.rounds[roundToDelete - 1]) {
    user.rounds[roundToDelete - 1].solves.splice(solveToDelete - 1, 1); // Remove the element at index
  } else {
    // Handle case where round doesn't exist
    return res
      .status(400)
      .json({ message: "Runda za korisnika nije pronađena." });
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
    return res.status(401).json({
      message: "Samo administratori mogu registrirati administratore.",
    });
  }

  // -1 : Username missing
  // -2 : Password missing
  // -3 : Username taken
  // -4 : Error while saving admin to database
  //  1 : Success
  const result = await createAdmin(adminUsername, adminPassword);
  if (result === 1) {
    return res
      .status(200)
      .json({ message: "Uspješno registriran administrator." });
  }
  if (result === -1) {
    return res.status(400).json({ message: "Korisničko ime nedostaje." });
  }
  if (result === -2) {
    return res.status(400).json({ message: "Lozinka nedostaje." });
  }
  if (result === -3) {
    return res.status(400).json({
      message: `Nije moguće registrirati administratora s korisničkim imenom ${adminUsername}. Korisničko ime je već zauzeto.`,
    });
  }
  if (result === -4) {
    return res.status(500).json({
      message: "Pogreška prilikom spremanja administratora u bazu podataka.",
    });
  }

  return res.status(500).json({
    message: "Nepoznat rezultat. Kontaktirajte programere.",
  });
});

app.get("/users/all", verifyToken, async (req, res) => {
  try {
    // Ensure only admins can access this route
    if (req.userRole !== "admin") {
      return res.status(401).json({
        message: "Samo administratori mogu dobiti informacije o korisnicima.",
      });
    }

    // Fetch all users from the database
    const users = await User.find({}, "username role rounds group");

    // Prepare the response array
    const usersInfo = users.map((user) => ({
      id: user._id,
      username: user.username,
      role: user.role,
      rounds: user.rounds,
      group: user.group,
    }));

    // Send the response array
    res.status(200).json(usersInfo);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});
app.get("/users/:userId", verifyToken, async (req, res) => {
  try {
    // Ensure only admins can access this route
    if (req.userRole !== "admin") {
      return res.status(401).json({
        message: "Samo administratori mogu dobiti informacije o korisnicima.",
      });
    }

    // Fetch all users from the database
    const user = await User.findById(req.params.userId, "username role rounds");

    // Send the response array
    res.status(200).json(user);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});
app.delete("/users/:userId", verifyToken, async (req, res) => {
  try {
    // Ensure only admins can access this route
    if (req.userRole !== "admin") {
      return res
        .status(401)
        .json({ message: "Samo administratori mogu brisati korisnike." });
    }

    const userId = req.params.userId; // Id of user to delete

    // Delete user with this id.
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    return res.status(200).json({ message: "Korisnik je uspješno izbrisan." });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: error.message });
  }
});
// Route handler for getting live solves
app.get("/live/solves", async (req, res) => {
  try {
    const usersWithSolves = await User.find({
      "rounds.solves": { $exists: true, $not: { $size: 0 } },
    }).select("username rounds group -_id");
    res.json(usersWithSolves);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving solves" });
  }
});

app.post("/change-password", verifyToken, async (req, res) => {
  const userId = req.body.userId;
  const newPassword = req.body.newPassword;
  if (req.userRole !== "admin") {
    return res.status(401).json({
      message: "Samo administratori smiju mijenjati lozinke.",
    });
  }
  if (!userId || !newPassword || newPassword.trim() === "") {
    return res.status(400).json({ message: "Nepotpun unos podataka." });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(400)
      .json({ message: "Ne postoji korisnik s tim ID-om." });
  }
  user.password = newPassword;
  await user.save();
  return res.status(200).json({ message: "Lozinka promijenjena." });
});

app.post("/new-post", verifyToken, async (req, res) => {
  if (req.userRole !== "admin") {
    return res
      .status(400)
      .json({ message: "Samo administratori smiju objavljivati." });
  }
  const username = req.user.username;
  const userId = req.userId;
  const title = req.body.title;
  const description = req.body.description;

  try {
    const newPost = await Post.create({
      title: title,
      description: description,
      author: {
        id: userId,
        username: username,
      },
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Neuspješno objavljivanje posta." });
  }
});

app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Neuspješno dohvaćanje postova." });
  }
});

app.get("/health-check", (req, res) => {
  return res.status(200).send();
});
// Start the server on the specified port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
createAdmin("admin", "admin");
