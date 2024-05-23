const User = require("../Models/user");
async function getUsernameById(id) {
  try {
    const user = await User.findOne({
      _id: {
        $eq: id,
      },
    }).select("+username");
    return user.username ? user.username : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
module.exports = { getUsernameById };
