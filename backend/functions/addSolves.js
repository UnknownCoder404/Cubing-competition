async function addSolves(solver, solves, round) {
  // Input validation
  if (!solver || !solves || typeof round !== "number") {
    return -1;
  }

  // Ensure rounds array exists
  if (!solver.rounds) {
    solver.rounds = [];
  }

  // Check if the round needs to be created
  if (round >= solver.rounds.length) {
    // Create new rounds to fill the gap
    solver.rounds.length = round + 1;
    // Initialize the new round with an empty solves array
    solver.rounds[round] = { solves: [] };
  }

  try {
    // Update the solves array for the specified round
    if (!solver.rounds[round]) {
      solver.rounds[round] = { solves: [] };
    }
    if (!solver.rounds[round].solves) {
      solver.rounds[round].solves = [];
    }
    solver.rounds[round].solves.push(...solves);

    // Save the updated user data
    await solver.save();

    // Success response
    return 1;
  } catch (err) {
    console.error("Pogreška dodavanja slaganja:\n", err);
    return -1;
  }
}
module.exports = addSolves;
