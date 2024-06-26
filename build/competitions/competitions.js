import { url } from "../Scripts/variables.js";
import {
  getAverage,
  formatTime,
  getAverageNoFormat,
} from "../Scripts/solveTime.js";
function addInteractive() {
  const rundeElements = document.querySelectorAll(".runda") || [];

  rundeElements.forEach((runde) => {
    const showHideButton = runde.querySelector(".showhide");
    const content = runde.querySelector(".content");

    content.classList.add("hidden"); // Use class for display toggling
    showHideButton.src = "../Images/show.svg";

    showHideButton.addEventListener("click", () => {
      content.classList.toggle("hidden"); // Use classList.toggle for concise logic
      showHideButton.src = showHideButton.src.endsWith("/show.svg")
        ? "../Images/hide.svg"
        : "../Images/show.svg";
    });
  });
}

async function getSolves() {
  const data = await fetch(`${url}/solves/get`, { method: "GET" });
  const competitions = await data.json();
  let solvesData = [[], []]; // Assuming there are only two groups
  competitions.solves.forEach((user) => {
    const username = user.username; // String
    const groupIndex = parseInt(user.group) - 1; // Convert "1" or "2" to 0 or 1
    user.rounds.forEach((round, index) => {
      if (round === null) {
        return;
      }
      const roundIndex = index; // 0, 1, or 2
      // Ensure the sub-array for the group and round exists
      solvesData[groupIndex][roundIndex] =
        solvesData[groupIndex][roundIndex] || [];
      // Create a string of all solves for the current round
      const solvesString = round.solves
        .map((solve) => (solve ? formatTime(solve).toString() : "DNF/DNS"))
        .join("  ");
      // Push the combined solves into the corresponding group and round
      solvesData[groupIndex][roundIndex].push({
        solve: solvesString,
        solves: round.solves,
        name: username,
      });
    });
  });

  return { solves: solvesData, lastUpdated: competitions.lastUpdated };
}
async function getWinner() {
  try {
    const data = await fetch(`${url}/winner/get`);
    const response = await data.json();
    return response;
  } catch (error) {
    const errorMessage =
      "Greška prilikom dohvaćanja pobjedniaka. Pokušajte ponovno.";
    alert(errorMessage);
    throw new Error(error);
  }
}
function sortGroups(groups) {
  // winners is an array of 0,1 or 2 objects, where object.group is 1 or 2.
  // sort it so that group 1 is at index 0 and group 2 at index 1, if there is not an winner with group 1 or 2, make it an empty object
  const winners = groups;
  // Custom comparator function
  const compareGroups = (a, b) => {
    if (a.group === undefined) return 1; // undefined group goes to the end
    if (b.group === undefined) return -1; // undefined group goes to the end
    return a.group - b.group; // sort by group number
  };

  // Sort the winners array
  winners.sort(compareGroups);

  // Ensure there are empty objects for groups with no winners
  if (winners.length === 0 || winners[0].group !== 1) {
    winners.unshift({ group: 1 }); // Add empty object for group 1 at index 0
  }
  if (winners.length === 1 || winners[1].group !== 2) {
    winners.splice(1, 0, { group: 2 }); // Add empty object for group 2 at index 1
  }

  return winners;
}
// Extract last updated time
function extractLastUpdated(data) {
  return data.lastUpdated;
}

// Update the "last-updated" element
function updateLastUpdatedElement(lastUpdated) {
  document.querySelector(
    ".last-updated"
  ).innerHTML = `Rezultati: ${lastUpdated}`;
}

// Sort participants within a round based on average solve time
function sortParticipants(round) {
  return round.sort((participantA, participantB) => {
    const averageA = getAverageNoFormat(participantA.solves);
    const averageB = getAverageNoFormat(participantB.solves);

    if (averageA === 0 && averageB === 0) return 0;
    if (averageA === 0) return 1;
    if (averageB === 0) return -1;
    if (averageA === -1 && averageB === -1) return 0;
    if (averageA === -1) return 1;
    if (averageB === -1) return -1;

    return averageA - averageB;
  });
}

// Build HTML for a participant
function buildParticipantHTML(participant, solveNumber) {
  const solve = participant.solve;
  const solves = participant.solves;
  const name = participant.name;
  const average = getAverage(solves);

  if (!solves || solves.length === 0) return "";

  return `
    <div class="solve">
      <p class="solves">
        <span class="bold">${solveNumber + 1}. ${name} </span>
        <span class="${
          average === "DNF" ? "red" : "average"
        }">(Prosjek: ${average})</span>
        <span class="solve-times">${solve}</span>
      </p>
    </div>`;
}

// Build HTML for a round
function buildRoundHTML(round, roundNumber) {
  let roundHTML = `
    <div class="runda" id="runda${roundNumber}">
      <div class="comp-title">
        <h3>Runda ${roundNumber}</h3>
        <img src="../Images/hide.svg" class="showhide">
      </div>
      <div class="content">`;

  sortParticipants(round).forEach((participant, solveNumber) => {
    roundHTML += buildParticipantHTML(participant, solveNumber);
  });

  roundHTML += `</div></div>`;
  return roundHTML;
}

// Build HTML for a group
function buildGroupHTML(group, groupNumber, winnerUsername) {
  let groupHTML = `<div class="grupa-${groupNumber}">`;

  groupHTML +=
    groupNumber === 1 ? `<h3>Razredi 1-4</h3>` : `<h3>Razredi 5-8</h3>`;

  for (let i = 0; i < 3; i++) {
    const round = group[i] || [];
    const roundNumber = i + 1;
    groupHTML += buildRoundHTML(round, roundNumber);
  }

  groupHTML += winnerUsername
    ? `<p>Pobjednik je ${winnerUsername}.</p>`
    : `<p>Nema upisanog pobjednika.</p>`;
  groupHTML += `</div>`;

  return groupHTML;
}

// Main function to display competition
async function displayCompetition(data) {
  const lastUpdated = extractLastUpdated(data);
  updateLastUpdatedElement(lastUpdated);

  const solves = data.solves;
  const winners = sortGroups(await getWinner());

  let html = "";
  solves.forEach((group, index) => {
    const groupNumber = index + 1;
    const winnerUsername = winners[index]?.username;
    html += buildGroupHTML(group, groupNumber, winnerUsername);
  });

  return html;
}

async function main() {
  document.querySelector(".grupe").innerHTML = await displayCompetition(
    await getSolves()
  );
  addInteractive();
}
main();
