// TODO: SEPERATE MONGOOSE MODELS, AND AFTER THE ROUTES
// Require the necessary modules
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
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
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/admin/assign", require("./routes/admin/assign"));
app.use("/solves/add", require("./routes/solves/add"));
app.use("/solves/delete", require("./routes/solves/delete"));
app.use("/users/all", require("./routes/users/all"));
app.use("/users", require("./routes/users/get"));
app.use("/users", require("./routes/users/delete"));

// Route handler for getting live solves
app.get("/live/solves", async (req, res) => {
  try {
    const usersWithSolves = await User.find({
      "rounds.solves": { $exists: true, $not: { $size: 0 } },
    }).select("username solves rounds group -_id");
    res.json({
      solves: usersWithSolves,
      lastUpdated: new Intl.DateTimeFormat("en-US", {
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date()),
    });
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
    // Construct response object with usernames
    const response = await Promise.all(
      posts.map(async (post) => ({
        title: post.title,
        description: post.description,
        author: {
          id: post.author.id, // Assuming this is the correct field for the author's id
          username: (await User.findById(post.author.id)).username,
        },
        createdAt: post.createdAt,
      }))
    );
    res.status(200).json(response); // Sending the constructed response
  } catch (err) {
    res.status(500).json({ message: "Neuspješno dohvaćanje postova." });
  }
});

app.get("/results", verifyToken, async (req, res) => {
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
        if (round.solves && round.solves.length > 0) {
          // Add the solves to the corresponding round in the row object
          row[`round${index + 1}`] = round.solves.join(", ");
        }
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
    console.error("Failed to generate results:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/passwords", verifyToken, async (req, res) => {
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
    users.forEach((user) => {
      sheet.addRow({ username: user.username, password: user.password });
    });

    // Write to a file
    const fileName = "UserPasswords.xlsx";
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
    res.status(500).send("An error occurred while generating the Excel file");
  }
});
app.post("/announce-winner", verifyToken, async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res.status(400).json({ message: "Id korisnika je potreban." });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "Korisnik ne postoji." });
    }
    const group = user.group;
    // Provjerite postoji li već pobjednik za grupu
    let existingWinner = await winner.findOne({ group });
    if (existingWinner && existingWinner.id === id) {
      // Koristite _id za brisanje dokumenta pobjednika
      await winner.findByIdAndDelete(existingWinner._id);
      return res.status(200).json({ message: "Pobjednik uspješno izbrisan." });
    }
    if (existingWinner) {
      // Ako već postoji pobjednik, ažurirajte ID pobjednika
      existingWinner.id = id;
      await existingWinner.save();
      return res
        .status(200)
        .json({ message: "Pobjednik uspješno promijenjen." });
    }

    // Stvorite novog pobjednika
    const newWinner = new winner({ group, id });
    // Spremite pobjednika u bazu podataka
    await newWinner.save();
    res.status(201).json({ message: "Pobjednik uspješno objavljen." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška kod servera." });
  }
});

app.get("/get-winners", async (req, res) => {
  try {
    const winners = await winner.find({}, "id group");
    for (let index = 0; index < winners.length; index++) {
      const user = await User.findById(winners[index].id);
      winners[index].username = user ? user.username : "Nepoznato";
    }
    // Construct response object with usernames
    const response = winners.map((winner) => ({
      id: winner.id,
      group: winner.group,
      username: winner.username,
    }));
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Greška unutar servera." });
  }
});
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

app.get("/health-check", (req, res) => {
  return res.status(200).send();
});
// Start the server on the specified port
const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
