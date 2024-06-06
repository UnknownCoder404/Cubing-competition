import {
  formatInputToSeconds,
  formatTime,
  getAverage,
} from "../Scripts/solveTime.js";
import {
  getRole,
  getId,
  getToken,
  tokenValid,
  isUser,
  addToken,
} from "../Scripts/credentials.js";
import { url, loadingHTML } from "../Scripts/variables.js";
const usersDiv = document.querySelector(".users");
function loggedIn() {
  return Boolean(getToken()) && Boolean(getRole()) && Boolean(getId());
}
window.setWinner = async function (id) {
  const setWinnerBtn = document.querySelector(`.set-winner-${id}`);
  const previousHtml = setWinnerBtn.innerHTML;
  setWinnerBtn.disabled = true;
  setWinnerBtn.innerHTML = loadingHTML;
  const data = await fetch(`${url}/winner/announce`, {
    method: "POST",
    body: JSON.stringify({
      id: id,
    }),
    headers: addToken({
      "Content-Type": "application/json",
    }),
  });
  const response = await data.json();
  setWinnerBtn.disabled = false;
  setWinnerBtn.innerHTML = previousHtml;
  alert(response.message);
};
window.showCompetition = async function (userId, index) {
  const allUserDiv = document.querySelectorAll(".user");
  const userDiv = allUserDiv[index];
  const showCompBtn = userDiv.querySelector(".showComp-btn");
  // Make showCompBtn innerHtml's to variable 'loadingHTML' and revert changes back
  const prevHTML = showCompBtn.innerHTML;
  showCompBtn.disabled = true;
  showCompBtn.innerHTML = loadingHTML;

  let html = "";
  const user = await fetch(`${url}/users/${userId}`, {
    headers: addToken({}),
  }).then((response) => response.json());
  showCompBtn.disabled = false;
  // Check if user data exists
  if (!user) {
    html = `<p>User not found.</p>`;
    userDiv.querySelector(".comp").innerHTML = html;
    showCompBtn.innerHTML = prevHTML;
    return;
  }
  // Loop through rounds
  for (let i = 0; i < 3; i++) {
    const round = user.rounds[i] || [];
    html += `<div class="round">`;
    html += `<h3>Runda ${i + 1}</h3>`;
    // Check if solves exist for the round
    if (round.solves && round.solves.length > 0) {
      html += `<p>Ao5: ${getAverage(round.solves)}</p>`;
      html += `<ul>`;
      for (let j = 0; j < round.solves.length; j++) {
        const time =
          round.solves[j] === 0 ? "DNF/DNS" : formatTime(round.solves[j]); // if 0, display DNF/DNS
        html += `<li>Slaganje ${j + 1}: ${time}</li>`;
        html += `<button type="button" onclick="deleteSolve('${userId}', ${i}, ${j}, ${index})">Izbriši</button></li>`;
      }
      html += `</ul>`;
    } else {
      html += `<p>Nema slaganja za ovu rundu.</p>`;
    }

    // Add form to add solves (assuming you have elements with these IDs)
    if (!round.solves || round.solves.length < 5) {
      html += `<form id="add-solve-${i}">
              <label for="solve-${i}">Slaganje:</label>`;
      html += `<input inputmode="numeric" pattern="[0-9 ]*" placeholder="npr. 15467" type="text" id="solve-${i}-${index}" name="solve" data-id="${userId}" data-i="${i}" data-index="${index}" class="solve-input"/>`;
      html += `<button class="solve-add-btn" type="button" onclick="addSolve('${userId}', ${i}, ${index})">Dodaj</button>
      </form>
    `;
      // Issue: #2 https://github.com/UnknownCoder404/Cubing-competition/issues/2
    }
    // Close .round div
    html += `</div>`;
  }

  userDiv.querySelector(".comp").innerHTML = html;
  showCompBtn.innerHTML = prevHTML;
  const solveTimeInputs = document.querySelectorAll(".solve-input");
  solveTimeInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const userId = input.dataset.id;
        const i = +input.dataset.i;
        const index = +input.dataset.index;
        addSolve(userId, i, index);
      }
    });
  });
}; // Make showCompetition() global by using window.showCompetition = ...

window.addSolve = async function (userId, roundIndex, index) {
  const solveInput = document.getElementById(`solve-${roundIndex}-${index}`);
  let solveValue = solveInput.value;

  // Provjerava odgovara li unos regularnom izrazu za brojeve odvojene razmacima
  if (!solveValue.match(/^\d+(?:[ .]\d+)*$/)) {
    console.error(
      "Pokušali ste dodati slaganja, ali unos ne odgovara regularnom izrazu."
    );
    alert("Samo brojevi i razmaci. Ne koristi dva razmaka jedan pored drugog.");
    return;
  }

  // Razdvaja unesene vrijednosti i filtrira prazne stringove
  let solves = solveValue.split(" ").filter(Boolean);

  // Uklanja null, NaN i brojeve dulje od 6 znamenki
  solves = solves.filter((solve) => solve && solve.length <= 6);

  // Ograničava na maksimalno 5 slaganja
  if (solves.length > 5) {
    solves = solves.slice(0, 5);
    alert("Uneseno više od 5 slaganja, samo prvih 5 će biti poslano.");
  }

  solves = solves.map((solve) => formatInputToSeconds(solve));
  if (solves.length === 0) {
    alert("Mora biti barem 1 slaganje.");
    return;
  }
  const roundNumber = roundIndex + 1;
  const solveData = {
    round: roundNumber,
    solves,
  };

  // Šalje podatke na server
  const response = await fetch(`${url}/solves/add/${userId}`, {
    method: "POST",
    headers: addToken({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(solveData),
  });

  const data = await response.json();

  // Ažurira prikaz natjecanja nakon uspješnog dodavanja
  if (response.ok) {
    showCompetition(userId, index);
    return;
  }

  // Prikazuje poruku o grešci ako postoji
  if (data.message) {
    alert(data.message);
    return;
  }

  alert("Greška prilikom dodavanja slaganja. Pokušaj ponovno.");
};

window.getUsers = async function () {
  const body = {
    method: "GET",
    headers: addToken({}),
  };
  try {
    const data = await fetch(`${url}/users/all`, body);
    const result = await data.json();
    return result;
  } catch (error) {
    console.error(error);
    alert("Greška prilikom povezivanja.");
  }
};

window.deleteUser = async function (id) {
  if (id === getId()) {
    alert("Nedopušteno brisanje vlastitog računa.");
    return;
  }
  try {
    const body = {
      method: "DELETE",
      headers: addToken({}),
    };
    const data = await fetch(`${url}/users/${id}`, body);
    const result = await data.json();
    if (data.ok) {
      main();
      return;
    }
    console.error("Greška prilikom brisanja korisnika.\n", result.message);
    alert("Greška prilikom brisanja korisnika.");
  } catch (error) {
    console.error(error);
    alert(error);
  }
};

window.assignAdmin = async function (id, username) {
  const body = {
    method: "POST",
    headers: addToken({}),
  };
  try {
    const data = await fetch(`${url}/admin/assign/${id}`, body);
    const response = await data.json();
    alert(response.message);
    if (data.ok) {
      main();
      return;
    }
  } catch (error) {
    console.error(error);
    alert(error);
  }
};

window.displayUsers = function (users) {
  let html = "";
  usersDiv.innerHTML = "";
  users.forEach((user, index) => {
    const username = user.username;
    const id = user.id;
    const role = user.role;
    const group = user.group;
    html += `<div class="user">`;
    html += `<div class="username-div">`;
    html += `<p class="username">${username}</p>`;
    html += `<img class="manage-accounts" src="../Images/manage_accounts.svg"/>`;
    html += `</div>`; // close .username-div
    html += `<p class="role">Uloga: ${role}</p>`;
    html += `<p class="group">Grupa ${group}</p>`;
    // Add a delete button for each user
    html += `<button onclick="deleteUser('${id}')">Izbriši</button>`;
    html += `<button onclick="assignAdmin('${id}', '${username}')">Postavi za admina</button>`;
    html += `<button class="showComp-btn" onclick="showCompetition('${id}', ${index})">Natjecanje</button>`;
    html += `<button class="set-winner-${id}" onclick="setWinner('${id}')">Pobjednik</button>`;
    html += `<div class="comp">`;
    html += `</div>`;
    html += `</div>`; // end user div
  });
  usersDiv.innerHTML = html;
};

window.deleteSolve = async function (userId, roundIndex, solveIndex, index) {
  const roundNumber = roundIndex + 1;
  const solveNumber = solveIndex + 1;
  // Call the backend to delete the solve
  const response = await fetch(`${url}/solves/delete/${userId}`, {
    method: "DELETE",
    headers: addToken({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ round: roundNumber, solve: solveNumber }),
  });

  if (response.ok) {
    // Remove the solve from the DOM or refresh the list of solves
    showCompetition(userId, index);
    return;
  }
  // Handle errors
  const error = await response.json();
  alert(error.message);
};

function getTime() {
  // Get the current date and time in GMT+1
  const now = new Date();
  const cetTime = new Date(now.getTime());

  // Extract hours and minutes
  const hours = cetTime.getHours().toString().padStart(2, "0"); // Pad hours with leading zero
  const minutes = cetTime.getMinutes().toString().padStart(2, "0"); // Pad minutes with leading zero
  //const seconds = cetTime.getSeconds().toString().padStart(2, "0"); // Pad minutes with leading zero

  // Format the time string (24-hour format)
  const formattedTime = `${hours}:${minutes}`;

  // Update the content of the HTML element with the formatted time string
  // You will need to replace this with your specific method to update the HTML element
  document.getElementById("currentTime").innerText = formattedTime;
}

async function main() {
  tokenValid(true);
  if (isUser(getRole())) {
    alert("Admins only!");
    location.href = "../";
  }
  getToken();

  const users = await getUsers();
  displayUsers(users);
}
getTime();
main();

// Call the function every second to update the time automatically
setInterval(getTime, 1000 * 1);
setInterval(() => tokenValid(true), 1000 * 60 * 10); // Every 10 minutes
const advancedDashboardBtn = document.querySelector(".advanced-dashboard-btn");
advancedDashboardBtn.addEventListener("click", () => {
  window.location.href = "../advanced-dashboard";
});
