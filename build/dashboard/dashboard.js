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
async function setWinner(id) {
  const setWinnerBtn = document.querySelector(`.set-winner-${id}`);
  const previousHtml = setWinnerBtn.innerHTML;
  setWinnerBtn.disabled = true;
  setWinnerBtn.innerHTML = loadingHTML;
  const data = await fetch(`${url}/announce-winner`, {
    method: "POST",
    body: JSON.stringify({
      id: id,
    }),
    headers: {
      Authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
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
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }).then((response) => response.json());
  showCompBtn.disabled = false;
  // Check if user data exists
  if (!user) {
    html = `<p>User not found.</p>`;
    userDiv.querySelector(".comp").innerHTML = html;
    showCompBtn.innerHTML = prevHTML;
    showCompBtn.disabled = false;
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
    if ((round.solves && round.solves.length < 5) || !round.solves) {
      html += `<form id="add-solve-${i}">
              <label for="solve-${i}">Slaganje:</label>`;
      html += `<input placeholder="npr. 15467" type="number" id="solve-${i}" name="solve">`;
      html += `<button type="button" onclick="addSolve('${userId}', ${i}, ${index})">Dodaj</button>
      </form>
    `;
    }
    // Close .round div
    html += `</div>`;
  }

  userDiv.querySelector(".comp").innerHTML = html;
  showCompBtn.innerHTML = prevHTML;
}
async function addSolve(userId, roundIndex, index) {
  const solveInput = document.getElementById(`solve-${roundIndex}`);
  let solveValue = solveInput.value;
  // Check if solve value is a number
  if (
    (!solveValue && solveValue !== 0) || // If falsy, but not 0
    solveValue.toString().trim() === ""
  ) {
    alert("Please enter a valid solve value (number).");
    return;
  }
  solveValue = formatTimeString(solveValue);
  const solveData = {
    round: roundIndex + 1,
    solves: [parseFloat(solveValue)],
  };
  const response = await fetch(`${url}/solves/add/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(solveData),
  });

  if (response.ok) {
    const data = await response.json();
    // Update the competition display after successful addition
    showCompetition(userId, index);
  } else {
    const data = await response.json();
    if (data.message) {
      alert(data.message);
    } else {
      alert("Failed to add solve. Please try again. Reason: Unknown");
    }
  }
}

async function getUsers() {
  const body = {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try {
    const data = await fetch(`${url}/users/all`, body);
    if (data.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      alert("Login again.");
      location.href = "../Login/";
    }
    const result = await data.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function deleteUser(id) {
  if (id === localStorage.getItem("id")) {
    alert("Cannot delete own account.");
    return;
  }
  try {
    const body = {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    const data = await fetch(`${url}/users/${id}`, body);
    const result = await data.json();
    if (data.ok) {
      main();
    } else {
      alert("Failed to delete user.");
    }
  } catch (error) {
    console.error(error);
    alert(error);
  }
}

async function assignAdmin(id, username) {
  const body = {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try {
    const data = await fetch(`${url}/admin/assign/${id}`, body);
    const result = await data.json();

    if (data.ok) {
      alert(`Successfully made ${username} admin.`);
      main();
    } else {
      alert(result.message);
    }
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
    html += `<p class="username">${username} (${id})</p>`;
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
  // Call the backend to delete the solve
  const response = await fetch(`${url}/solves/delete/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ round: roundIndex + 1, solve: solveIndex + 1 }),
  });

  if (response.ok) {
    // Remove the solve from the DOM or refresh the list of solves
    showCompetition(userId, index);
  } else {
    // Handle errors
    const error = await response.json();
    alert(error.message);
  }
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
  timeParts.push(`.${milliseconds.toString().padStart(3, "0").slice(0, 2)}`); // Updated line
  console.log(`Formatted ${seconds}s to ${timeParts.join("")}`);
  // Return the formatted time string
  return timeParts.join("");
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
  if (localStorage.getItem("role") === "user") {
    alert("Admins only!");
    location.href = "../";
  }
  if (!localStorage.getItem("token")) {
    alert("Login again.");
    location.href = "../Login";
  }

  let users = await getUsers();
  displayUsers(users);
}
getTime();
main();

// Call the function every 10 seconds to update the time automatically
setInterval(getTime, 1000 * 10);
