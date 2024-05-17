const usersDiv = document.querySelector(".users");
const url = "https://cubing-competition.onrender.com";
const loadingHTML = `<div id="circularG">
<div id="circularG_1" class="circularG"></div>
<div id="circularG_2" class="circularG"></div>
<div id="circularG_3" class="circularG"></div>
<div id="circularG_4" class="circularG"></div>
<div id="circularG_5" class="circularG"></div>
<div id="circularG_6" class="circularG"></div>
<div id="circularG_7" class="circularG"></div>
<div id="circularG_8" class="circularG"></div>
</div>`;
String.prototype.addToken = function (token = getToken()) {
  return `${this}${this.includes("?") ? "&" : "?"}token=${token}`;
};
Object.prototype.addToken = function (token = getToken()) {
  let object = this;
  object.Authorization = token;
  return object;
};
String.prototype.isUser = function () {
  return this.toUpperCase() === "USER";
};
String.prototype.isAdmin = function () {
  return this.toUpperCase() === "ADMIN";
};
function getUsername() {
  const username = localStorage.getItem("username");
  if (!username) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return username;
}
function getRole() {
  const role = localStorage.getItem("role");
  if (!role) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return role;
}
function getId() {
  const id = localStorage.getItem("id");
  if (!id) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return id;
}
function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return token;
}
function logOut(refresh = false) {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  if (refresh) {
    window.location.reload();
  }
}
async function setWinner(id) {
  const setWinnerBtn = document.querySelector(`.set-winner-${id}`);
  const previousHtml = setWinnerBtn.innerHTML;
  setWinnerBtn.disabled = true;
  setWinnerBtn.innerHTML = loadingHTML;
  const data = await fetch(`${url}/winner/announce`, {
    method: "POST",
    body: JSON.stringify({
      id: id,
    }),
    headers: {
      "Content-Type": "application/json",
    }.addToken(),
  });
  const response = await data.json();
  setWinnerBtn.disabled = false;
  setWinnerBtn.innerHTML = previousHtml;
  alert(response.message);
}
async function showCompetition(userId, index) {
  const allUserDiv = document.querySelectorAll(".user");
  const userDiv = allUserDiv[index];
  const showCompBtn = userDiv.querySelector(".showComp-btn");
  // Make showCompBtn innerHtml's to variable 'loadingHTML' and revert changes back
  const prevHTML = showCompBtn.innerHTML;
  showCompBtn.disabled = true;
  showCompBtn.innerHTML = loadingHTML;

  let html = "";
  const user = await fetch(`${url}/users/${userId}`, {
    headers: {}.addToken(),
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
      html += `<input placeholder="npr. 15467" type="text" id="solve-${i}-${index}" name="solve" data-id="${userId}" data-i="${i}" data-index="${index}" class="solve-input">`;
      html += `<button type="button" onclick="addSolve('${userId}', ${i}, ${index})">Dodaj</button>
      </form>
    `;
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
}
async function addSolve(userId, roundIndex, index) {
  const solveInput = document.getElementById(`solve-${roundIndex}-${index}`);
  let solveValue = solveInput.value;

  // Provjerava odgovara li unos regularnom izrazu za brojeve odvojene razmacima
  if (!solveValue.match(/^\d+(?: \d+)*$/)) {
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

  // Formatira svako slaganje pomoću funkcije formatTimeString
  solves = solves.map((solve) => formatTimeString(solve));
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
    headers: {
      "Content-Type": "application/json",
    }.addToken(),
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
}

async function getUsers() {
  const body = {
    method: "GET",
    headers: {}.addToken(),
  };
  try {
    const data = await fetch(`${url}/users/all`, body);
    const result = await data.json();
    return result;
  } catch (error) {
    console.error(error);
    alert("Greška prilikom povezivanja.");
  }
}

async function deleteUser(id) {
  if (id === getId()) {
    alert("Nedopušteno brisanje vlastitog računa.");
    return;
  }
  try {
    const body = {
      method: "DELETE",
      headers: {}.addToken(),
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
}

async function assignAdmin(id, username) {
  const body = {
    method: "POST",
    headers: {}.addToken(),
  };
  try {
    const data = await fetch(`${url}/admin/assign/${id}`, body);
    const result = await data.json();

    if (data.ok) {
      alert(`Korisnik "${username}" je administrator.`);
      main();
      return;
    }
    alert(result.message);
  } catch (error) {
    console.error(error);
    alert(error);
  }
}

function displayUsers(users) {
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
}
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

async function deleteSolve(userId, roundIndex, solveIndex, index) {
  const roundNumber = roundIndex + 1;
  const solveNumber = solveIndex + 1;
  // Call the backend to delete the solve
  const response = await fetch(`${url}/solves/delete/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }.addToken(),
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
}
function downloadFile(url, fileName) {
  if (!url || !fileName) return -1;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  return 1;
}

function getResults() {
  const resultsUrl = `${url}/results`.addToken();
  downloadFile(resultsUrl, "results"); // You can specify the desired file name
}

function getPasswords() {
  const passwordsUrl = `${url}/passwords`.addToken();
  downloadFile(passwordsUrl, "passwords"); // You can specify the desired file name
}
function getAverage(solves) {
  if (solves.length !== 5) {
    return "Need 5 solves";
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
  timeParts.push(`.${milliseconds.toString().padStart(3, "0").slice(0, 2)}`);
  const formattedTime = timeParts.join("");
  // Return the formatted time string
  return formattedTime;
}

function formatTimeString(str) {
  // Check if the string is already in the format of a decimal number
  if (str.includes(".")) {
    return parseFloat(str);
  }

  // Handle formatting based on the length of the string
  switch (str.length) {
    case 1:
      return parseFloat(`0.0${str}`);
    case 2:
      return parseFloat(`0.${str}`);
    case 3:
      return parseFloat(`${str.charAt(0)}.${str.substring(1)}`);
    case 4:
      return parseFloat(`${str.substring(0, 2)}.${str.substring(2)}`);
    case 5:
      return (
        60 * parseInt(str.charAt(0)) +
        parseFloat(`${str.substring(1, 3)}.${str.substring(3)}`)
      );
    case 6:
      return (
        60 * parseInt(str.substring(0, 2)) +
        parseFloat(`${str.substring(2, 4)}.${str.substring(4)}`)
      );
    default:
      return null; // or any other default value for invalid input
  }
}

async function main() {
  if (getRole().isUser()) {
    alert("Admins only!");
    location.href = "../";
  }
  getToken();

  const users = await getUsers();
  displayUsers(users);
}
getTime();
main();

// Call the function every 10 seconds to update the time automatically
setInterval(getTime, 1000 * 10);
