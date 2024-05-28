const mongoose = require("mongoose");
const verifyPassword = require("../functions/verifyPassword");
const solveSchema = new mongoose.Schema({ solves: [Number] });
// Define a schema for the user model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "user"] },
  rounds: [solveSchema],
  group: { type: Number, enum: [1, 2], required: true },
});
// Add a method to compare the password with the hashed one
userSchema.methods.comparePassword = async function (password) {
  try {
    // Return a boolean value indicating the match
    return verifyPassword(password, this.password);
  } catch (err) {
    // Handle the error
    throw err;
  }
};
// Create a user model from the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
