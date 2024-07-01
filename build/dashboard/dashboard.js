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
window.setWinner = async function (winnerId) {
  const winnerButton = document.querySelector(`.set-winner-${winnerId}`);
  const originalHTML = winnerButton.innerHTML;

  try {
    toggleButtonState(winnerButton, true, loadingHTML);
    const response = await announceWinner(winnerId);
    alert(response.message);
  } catch (error) {
    console.error("Error announcing the winner:", error);
    alert("Nije uspjelo postavljanje pobjednika. Molim te pokušaj ponovno.");
  } finally {
    toggleButtonState(winnerButton, false, originalHTML);
  }
};
function toggleButtonState(button, isDisabled, htmlContent) {
  button.disabled = isDisabled;
  button.innerHTML = htmlContent;
}
async function announceWinner(winnerId) {
  const response = await fetch(`${url}/winner/announce`, {
    method: "POST",
    body: JSON.stringify({ id: winnerId }),
    headers: addToken({ "Content-Type": "application/json" }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }

  return response.json();
}
function createCompetitionHtml(competition) {
  let html = "";
  competition.events.forEach((event, index) => {
    // solves is an object which follows this structure:
    /*
  {
    _id: "6681a0d0effeb1adfadfd",
    event: "3x3",
    solves: [3, 1, 5],
  },
    */
    const eventName = event.event;
    html += `<div class="event ">
                <h3>${eventName}</h3>`;
    html += `<ul class="solves">`;
    solves.solves.forEach((solve, j) => {
      const time = solve === 0 ? "DNF/DNS" : formatTime(solve);
      html += `<li>${j + 1}: ${time}
                   </li>`;
    });
    html += `</ul>`; // close .solves
    html += `</div>`; // close .event
  });
  return html;
}
window.showCompetition = async function (userId, index) {
  enableAllSolveButtons();
  const allUserDiv = document.querySelectorAll(".user");
  const userDiv = allUserDiv[index];
  const showCompBtn = userDiv.querySelector(".showComp-btn");
  const prevHTML = showCompBtn.innerHTML;
  showCompBtn.disabled = true;
  showCompBtn.innerHTML = loadingHTML;

  try {
    const user = await fetch(`${url}/users/${userId}`, {
      headers: addToken({}),
    }).then((response) => response.json());

    if (!user) {
      userDiv.querySelector(".comp").innerHTML = `<p>User not found.</p>`;
      return;
    }
    if (!user.competitions || user.competitions.length === 0) {
      userDiv.querySelector(
        ".comp"
      ).innerHTML = `<p>Korisnik nema unesenih slaganja.</p>`;
      return;
    }
    userDiv.querySelector(".comp").innerHTML = "";
    user.competitions.forEach((competition, index) => {
      const competitionHtml = createCompetitionHtml(competition);

      userDiv
        .querySelector(".comp")
        .insertAdjacentHTML("beforeend", competitionHtml);
    });
    return;
    for (let i = 0; i < 3; i++) {
      const round = user.rounds[i] || [];
      html += `<div class="round">
                <h3>Runda ${i + 1}</h3>`;

      if (round.solves && round.solves.length > 0) {
        html += `<p>Ao5: ${getAverage(round.solves)}</p>
                 <ul>`;
        round.solves.forEach((solve, j) => {
          const time = solve === 0 ? "DNF/DNS" : formatTime(solve);
          html += `<li>${j + 1}: ${time}
                   <button type="button" onclick="deleteSolve('${userId}', ${i}, ${j}, ${index})">Izbriši</button></li>`;
        });
        html += `</ul>`;
      } else {
        html += `<p>Nema slaganja za ovu rundu.</p>`;
      }

      if (!round.solves || round.solves.length < 5) {
        html += `<form id="add-solve-${i}">
                  <label for="solve-${i}">Slaganje:</label>
                  <input inputmode="numeric" pattern="[0-9 ]*" placeholder="npr. 15467" type="text" id="solve-${i}-${index}" name="solve" data-id="${userId}" data-i="${i}" data-index="${index}" class="solve-input"/>
                  <button class="solve-add-btn" type="button" onclick="addSolve('${userId}', ${i}, ${index})">Dodaj</button>
                 </form>`;
      }

      html += `</div>`;
    }

    userDiv.querySelector(".comp").innerHTML = html;

    const solveTimeInputs = userDiv.querySelectorAll(".solve-input");
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
  } catch (error) {
    console.error("Error fetching user data:", error);
    userDiv.querySelector(
      ".comp"
    ).innerHTML = `<p>Error loading competition data.</p>`;
  } finally {
    showCompBtn.disabled = false;
    showCompBtn.innerHTML = prevHTML;
  }
}; // Make showCompetition() global by using window.showCompetition = ...

window.addSolve = async function (
  userId,
  roundIndex,
  userIndex,
  solves,
  event = "3x3",
  competitionId = "6681a3717073260f1dbd0a25"
) {
  const roundNumber = roundIndex + 1;
  const solveData = {
    round: roundNumber,
    solves: {
      event: event,
      rounds: solves,
    },
    competitionId,
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
    showCompetition(userId, userIndex);
    return response.status;
  }

  // Prikazuje poruku o grešci ako postoji
  if (data.message) {
    alert(data.message);
    return response.status;
  }

  alert("Greška prilikom dodavanja slaganja. Pokušaj ponovno.");
  return response.status;
};
//console.log(addSolve("6681a0d0effeb153aadd2a8d", 0, 0, [3, 1, 5]));
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
  disableAllSolveButtons();
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
  enableAllSolveButtons();
};
function disableAllSolveButtons() {
  const solveButtons = document.querySelectorAll(".solve-add-btn");
  solveButtons.forEach((button) => {
    button.disabled = true;
  });
}
function enableAllSolveButtons() {
  const solveButtons = document.querySelectorAll(".solve-add-btn");
  solveButtons.forEach((button) => {
    button.disabled = false;
  });
}

async function main() {
  tokenValid(true);
  if (isUser(getRole())) {
    alert("Samo administratori");
    location.href = "../";
  }
  getToken();

  const users = await getUsers();
  displayUsers(users);
}
main();

setInterval(() => tokenValid(true), 1000 * 60 * 10); // Every 10 minutes
