// Require the necessary modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const getCurrentDateTimeInZagreb = require("./functions/getCurrentDateTimeInZagreb");
const generalLimiter = require("./rateLimiter/general");
// Load the environment variables from the .env file
dotenv.config();

// Create an express app
const app = express();
app.set("trust proxy", 2);
app.get("/ip", (request, response) => response.send(request.ip));
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
app.use(generalLimiter);
// Connect to the MongoDB database using mongoose
console.log("Trying to connect to mongoDB...");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {})
  .catch((err) => console.error("Failed to connect to MongoDB: \n" + err));
console.log("Current Date and time in Zagreb:");
console.table(getCurrentDateTimeInZagreb());
// register and login
app.use("/register", require("./routes/users/register"));
app.use("/login", require("./routes/users/login"));
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
app.use("/results", require("./routes/excel/results"));
app.use("/passwords", require("./routes/excel/passwords"));
// Winner
app.use("/winner", require("./routes/winner/announce"));
app.use("/winner", require("./routes/winner/get"));
// Scrambles
app.use("/scrambles", require("./routes/scrambles/passwords"));
// Token validation
app.use("/token", require("./routes/token/validate"));
app.use("/health-check", require("./routes/health_check/health_check"));
// Start the server on the specified port
console.log(`ENV PORT: ${process.env.PORT}`);
const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
