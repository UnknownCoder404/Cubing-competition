/*
File for checking if everything is configured correctly
*/
// precheck.js

import mongoose from "mongoose";
import { config } from "dotenv";

config();

console.log(`Running ${import.meta.url}`);

// List of required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

// List of optional environment variables
const optionalEnvVars = ["PORT"];

// Function to check if all required env vars are defined
const checkEnvVars = () => {
  let allVarsDefined = true;
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      console.warn(`Warning: Environment variable ${varName} is not defined.`);
      allVarsDefined = false;
    }
  });
  optionalEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      console.log(
        `Environment variable ${varName} is undefined, but is optional so continuing.`
      );
    }
  });
  return allVarsDefined;
};

// Function to check if the database connection is available
const checkDbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connection successful.");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

// Main function to perform prechecks
const precheck = async () => {
  if (!checkEnvVars()) {
    console.warn(
      "Some environment variables are missing. Please check your .env file."
    );
    process.exit(1); // Exit the process with failure
  }
  await checkDbConnection();
  console.log("Precheck successful.");
  process.exit(0); // Exit the process with success
};

// Execute precheck
precheck();
