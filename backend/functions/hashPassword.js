const bcrypt = require("bcrypt");
const saltRounds = 10;
const hashPassword = async (plainPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw new Error("Hashing failed");
  }
};
module.exports = hashPassword;
