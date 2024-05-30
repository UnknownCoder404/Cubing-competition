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
  const data = await fetch(`${url}/winner/get`);
  const response = await data.json();
  return response;
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
async function displayCompetition(data) {
  const lastUpdated = data.lastUpdated;
  data = data.solves;
  let html = "";
  document.querySelector(
    ".last-updated"
  ).innerHTML = `Rezultati: ${lastUpdated}`;
  const winners = sortGroups(await getWinner());
  data.forEach((group, index) => {
    const winnerUsername = winners[index].username;
    const groupNumber = index + 1;
    html += `<div class="grupa-${groupNumber}">`;
    html += groupNumber === 1 ? `<h3>Razredi 1-4</h3>` : `<h3>Razredi 5-8</h3>`;
    for (let i = 0; i < 3; i++) {
      const round = group[i] || [];
      const roundNumber = i + 1;
      html += `<div class="runda" id="runda${roundNumber}">`;
      html += `<div class="title">            
      <h3>Runda ${roundNumber}</h3>
      <img src="../Images/hide.svg" class="showhide">
    </div>`;
      html += `<div class="content">`;
      round.sort((a, b) => {
        const averageA = getAverageNoFormat(a.solves);
        const averageB = getAverageNoFormat(b.solves);

        if (averageA === 0 && averageB === 0) return 0; // If both averages are 0, maintain order
        if (averageA === 0) return 1; // If only averageA is 0, put a later
        if (averageB === 0) return -1; // If only averageB is 0, put b later
        if (averageA === -1 && averageB === -1) return 0; // If both averages are -1, maintain order
        if (averageA === -1) return 1; // If only averageA is -1, put a earlier
        if (averageB === -1) return -1; // If only averageB is -1, put b earlier

        // Regular sorting for other numbers
        return averageA - averageB;
      });

      round.forEach((SOLVE, index) => {
        const solve = SOLVE.solve;
        const solves = SOLVE.solves;
        if (!solves || solves.length === 0) return;
        const average = getAverage(solves);
        const name = SOLVE.name;
        const solveNumber = index + 1;
        html += `<div class="solve"> 
        <p  class="solves">    
        <span class="bold">${solveNumber}. ${name} </span>
        <span class="${
          average === "DNF" ? "red" : "average"
        }">(Prosjek: ${average})</span>
        <span class="solve-times">${solve}</span> 
        </p>
      </div>`;
      });
      html += `</div>`; // Zatvori content
      html += `</div>`; // Zatvori rundu
    }
    html += winnerUsername
      ? `<p>Pobjednik je ${winnerUsername}.</p>`
      : `<p>Nema upisanog pobjednika.</p>`;
    html += `</div>`; // Close group-# div
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
