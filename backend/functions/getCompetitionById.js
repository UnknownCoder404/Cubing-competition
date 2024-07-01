const Competition = require("../Models/competitions");

async function getCompetitionById(id, fields = null) {
  try {
    if (fields) {
      return await Competition.findOne({ _id: id }).select(fields);
    } else {
      return await Competition.findOne({ _id: id });
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
module.exports = { getCompetitionById };
