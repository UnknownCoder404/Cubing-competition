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
  let testData = [[], []]; // Assuming there are only two groups

  competitions.forEach((user) => {
    const username = user.username; // String
    const groupIndex = parseInt(user.group) - 1; // Convert "1" or "2" to 0 or 1
    user.rounds.forEach((round, index) => {
      const roundIndex = index; // 0, 1, or 2
      // Ensure the sub-array for the group and round exists
      testData[groupIndex][roundIndex] = testData[groupIndex][roundIndex] || [];
      // Create a string of all solves for the current round
      const solvesString = round.solves
        .map((solve) => (solve ? formatTime(solve).toString() : "DNF/DNS"))
        .join("  ");
      // Push the combined solves into the corresponding group and round
      testData[groupIndex][roundIndex].push({
        solve: solvesString,
        solves: round.solves,
        name: username,
      });
    });
  });

  return testData;
}
async function getWinner() {
  const data = await fetch(`${url}/get-winners`);
  const response = await data.json();
  return response;
}
async function displayCompetition(data) {
  let html = "";
  data.forEach((group, index) => {
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
