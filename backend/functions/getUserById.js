const User = require("../Models/user");
async function getUserById(id) {
  try {
    const user = await User.findOne({
      _id: {
        $eq: id,
      },
    });
    return user ? user : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
module.exports = { getUserById };
