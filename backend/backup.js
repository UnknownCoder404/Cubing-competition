const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const fs = require("fs");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to mongodb");
    main();
  })
  .catch((err) => console.error("Failed to connect to MongoDB: \n" + err));
async function main() {
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  console.log("Connected to the database.");

  const collectionName = "users";

  // Use the native MongoDB driver to get the collection data
  const collection = db.collection(collectionName);
  const data = JSON.stringify(await collection.find({}).toArray(), null, 2);
  // Write the JSON string to a file
  fs.writeFile(`${collectionName}-backup.json`, data, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return;
    }

    console.log(
      `Backup of the '${collectionName}' collection saved successfully.`
    );
  });
}
