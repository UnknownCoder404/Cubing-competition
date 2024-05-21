const User = require("../Models/user");
async function getUsernameById(id) {
  try {
    const user = await User.findById(winners[index].id);
    return user.username ? user.username : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
module.exports = { getUsernameById };
