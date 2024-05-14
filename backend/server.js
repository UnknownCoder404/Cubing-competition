// Require the necessary modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const exceljs = require("exceljs");
const verifyToken = require("./middleware/verifyToken");
const getCurrentDateTimeInZagreb = require("./functions/getCurrentDateTimeInZagreb");
const addSolves = require("./functions/addSolves");
// Import mongoose models
const User = require("./Models/user");
const Post = require("./Models/post");
const winner = require("./Models/winner");
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
  .then(() => {})
  .catch((err) => console.error("Failed to connect to MongoDB: \n" + err));

console.log(getCurrentDateTimeInZagreb());
// register and login
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
// admin
app.use("/admin/assign", require("./routes/admin/assign"));
// solves
app.use("/solves/add", require("./routes/solves/add"));
app.use("/solves/delete", require("./routes/solves/delete"));
app.use("/solves/get", require("./routes/solves/get"));
// users
app.use("/users/all", require("./routes/users/all"));
app.use("/users", require("./routes/users/get"));
app.use("/users", require("./routes/users/delete"));
// Posts
app.use("/posts/new", require("./routes/posts/new"));
app.use("/posts", require("./routes/posts/get"));
// Results in excel
app.use("/results", require("./routes/results"));
app.use("/passwords", require("./routes/passwords"));
// Winner
app.use("/winner", require("./routes/winner/announce"));
app.user("/winner", require("./routes/winner/get"));
/*
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
*/

app.get("/scrambles/passwords", verifyToken, (req, res) => {
  if (req.userRole !== "admin") {
    res.status(401).send("<p>Samo administratori imaju pristup lozinkama.</p>");
    return;
  }
  const currentDateTime = getCurrentDateTimeInZagreb();
  if (
    currentDateTime.year >= 2024 &&
    currentDateTime.month >= 5 &&
    currentDateTime.day >= 3 &&
    currentDateTime.hour >= 14
  ) {
    const htmlResponse = `
      <html>
        <head><title>Passwords</title>
        <style>/* Osnovni stil za desktop */
        p {
          font-size: 16px;
        }
        
        /* Stil za uređaje s maksimalnom širinom od 600px */
        @media (max-width: 600px) {
          p {
            font-size: 18px; /* Povećana veličina teksta za bolju čitljivost na telefonima */
          }
        }</style>
        </head>
        <body>
          <p style="font-size: 15px">Lozinka 1. grupe: ${process.env.G1PASSWORD}</p>
          <p>Lozinka 2. grupe: ${process.env.G2PASSWORD}</p>
          <p>NE DIJELI OVAJ LINK!!!!</p>
        </body>
      </html>`;
    res.status(200).send(htmlResponse);
    return;
  }
  res.status(401).send(`<p>Pristupno tek 03.05.2024 u 14:00</p>
   <p>NE DIJELI OVAJ LINK!!!!</p>`);
});
app.get("/token", verifyToken, (req, res) => {
  try {
    // Assuming verifyToken throws an error on invalid token
    res.status(200).json({ message: "Token is valid" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500);
  }
});
app.get("/health-check", (req, res) => {
  return res.status(200).send();
});
// Start the server on the specified port
const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
