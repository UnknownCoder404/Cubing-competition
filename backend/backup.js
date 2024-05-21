import { config } from "dotenv";
import mongoose from "mongoose";
import { writeFile } from "fs/promises";
import { exit } from "process";

config();

console.log(`Running ${import.meta.file}`);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to mongodb");
    main().then(() => {
      console.log("DONE...");
      exit();
    });
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
  try {
    await writeFile(`${collectionName}-backup.json`, data);
    console.log(
      `Backup of the '${collectionName}' collection saved successfully.`
    );
  } catch (err) {
    console.error("Error writing to file:", err);
  }
}
