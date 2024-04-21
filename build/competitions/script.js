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
        .map((solve) => solve.toString())
        .join(" ");
      // Push the combined solves into the corresponding group and round
      testData[groupIndex][roundIndex].push({
        solve: solvesString,
        name: username,
      });
    });
  });

  return testData;
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
        const name = SOLVE.name;
        const solveNumber = index + 1;

        html += `<div class="solve">
        <p><span class="bold">${solveNumber}. ${name}</span> <span class="solve-times">${solve}</span>
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
async function main() {
  document.querySelector(".grupe").innerHTML = await displayCompetition(
    await getSolves()
  );
  addInteractive();
}
main();
