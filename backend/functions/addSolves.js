async function addSolves(solver, solves, round, competition) {
  try {
    // Input validation
    if (!solver || !solves || typeof round !== "number" || !competition) {
      return -1;
    }

    const competitionId = competition._id;
    const competitionName = competition.name;

    if (!competitionName) {
      return -1;
    }

    if (!solver.competitions) {
      solver.competitions = [];
    }

    let solversCompetition = solver.competitions.find((competition) => {
      competition.competitionId === competitionId;
    });
    if (!solversCompetition) {
      solver.competitions.push({
        competitionId,
        solves: [],
      });
      solversCompetition = solver.competitions[0];
      console.log(solversCompetition);
    }
    // Fill everything up to the round with null
    for (let i = 0; i < round - 1; i++) {
      if (!solversCompetition.solves[i]) {
        solversCompetition.solves.push(null);
      }
    }
    // Add solves
    solversCompetition.solves = solves;

    // Limit solves to 5
    if (solversCompetition.solves.length > 5) {
      solversCompetition.solves = solversCompetition.solves.slice(0, 5);
    }
    // Save the updated user data
    await solver.save();

    // Success response
    return 1;
  } catch (error) {
    console.error("Error adding solves:\n", error);
    return -2;
  }
}

module.exports = addSolves;
