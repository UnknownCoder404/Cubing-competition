const url = "https://cubing-competition.onrender.com";
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
  const data = await fetch(`${url}/live/solves`, { method: "GET" });
  const competitions = await data.json();
  let solvesData = [[], []]; // Assuming there are only two groups

  competitions.solves.forEach((user) => {
    const username = user.username; // String
    const groupIndex = parseInt(user.group) - 1; // Convert "1" or "2" to 0 or 1
    user.rounds.forEach((round, index) => {
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

  return solvesData;
}
async function getWinner() {
  const data = await fetch(`${url}/get-winners`);
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
  let html = "";
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
      round.forEach((SOLVE, index) => {
        const solve = SOLVE.solve;
        const solves = SOLVE.solves;
        const average = getAverage(solves);
        const name = SOLVE.name;
        const solveNumber = index + 1;
        html += `<div class="solve"> 
        <p  class="solves">    
        <span class="bold">${solveNumber}. ${name}</span>
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
      ? `<p>Pobjednik je ${winnerUsername}`
      : `<p>Nema upisanog pobjednika.`;
    html += `</div>`; // Close group-# div
  });
  return html;
}
function getAverage(solves) {
  if (solves.length !== 5) {
    return "X";
  }

  // Create a copy of the solves array
  let sortedSolves = solves.slice();

  sortedSolves.sort((a, b) => {
    if (a === 0) return 1; // Place 0 at the last element
    if (b === 0) return -1; // Place 0 at the last element
    return a - b; // Regular sorting for other numbers
  });
  // Remove the smallest and largest elements
  let trimmedSolves = sortedSolves.slice(1, sortedSolves.length - 1);

  // Calculate average
  let average =
    trimmedSolves.reduce((acc, val) => acc + val, 0) / trimmedSolves.length;

  // Check if trimmedSolves contains 0
  if (trimmedSolves.includes(0)) {
    return "DNF";
  }

  // Return average rounded to 2 decimal places
  return formatTime(average);
}
function formatTime(seconds) {
  // Convert seconds to milliseconds without rounding
  const ms = seconds * 1000;

  // Calculate minutes, remaining seconds, and milliseconds
  const minutes = Math.floor(ms / 60000);
  const remainingSeconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000; // Corrected line

  // Initialize an array to hold the time parts
  let timeParts = [];

  // If there are minutes, add them to the time parts
  if (minutes > 0) {
    timeParts.push(`${minutes}:`);
  }

  // Add seconds and milliseconds to the time parts
  timeParts.push(`${remainingSeconds.toString().padStart(2, "0")}`);
  timeParts.push(`.${milliseconds.toString().padStart(3, "0").slice(0, 2)}`); // Updated line
  console.log(`Formatted ${seconds}s to ${timeParts.join("")}`);
  // Return the formatted time string
  return timeParts.join("");
}
async function main() {
  document.querySelector(".grupe").innerHTML = await displayCompetition(
    await getSolves()
  );
  addInteractive();
}
main();
