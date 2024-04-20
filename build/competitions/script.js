function addInteractive() {
  const rundeElements = document.querySelectorAll(".runda");

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

const testData = [
  [
    [
      {
        solve: "(69.69) (23) 43 34 30",
        name: "Jakov Čiček",
      },
    ],
    [
      {
        solve: "(69.69) (23) 43 34 30",
        name: "Jakov Čiček",
      }, // Runda 2
    ],
    [
      {
        solve: "(69.69) (23) 43 34 30",
        name: "Jakov Čiček",
      }, // Runda 3
    ],
  ], // Grupa 1
  [
    [
      {
        solve: "(69.69) (23) 43 34 30",
        name: "Jakov Čiček",
      }, // Runda 1
    ],
    [
      {
        solve: "(69.69) (23) 43 34 30",
        name: "Jakov Čiček",
      }, // Runda 2
    ],
    [
      {
        solve: "(69.69) (23) 43 34 30",
        name: "Jakov Čiček",
      }, // Runda 3
    ],
  ], // Grupa 2
];
async function getSolves() {}
async function displayCompetition(data) {
  let html = "";
  data.forEach((group, index) => {
    const groupNumber = index + 1;
    html += `<div class="grupa-${groupNumber}">`;
    html += groupNumber === 1 ? `<h3>Razredi 1-4</h3>` : `<h3>Razredi 5-8</h3>`;
    for (let i = 0; i < 3; i++) {
      const round = group[i];
      const roundNumber = i + 1;
      html += `<div class="runda" id="runda${roundNumber}">`;
      html += `<div class="title">            
      <h3>Runda ${roundNumber}</h3>
      <img src="../Images/hide.svg" class="showhide">
    </div>`;
      round.forEach((SOLVE, index) => {
        const solve = SOLVE.solve;
        const name = SOLVE.name;
        const solveNumber = index + 1;
        html += `<div class="content">`;
        html += `<div class="solve">
        <p><span class="bold">${solveNumber}. ${name}</span> ${solve}</p>
      </div>`;
        html += `</div>`; // Zatvori content
      });
      html += `</div>`; // Zatvori rundu
    }
    html += `</div>`; // Close group-# div
  });
  return html;
}
async function main() {
  document.querySelector(".grupe").innerHTML = await displayCompetition(
    testData
  );
  addInteractive();
}
main();
