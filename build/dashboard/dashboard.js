const usersDiv = document.querySelector(".users");
const url = "https://cubing-competition.onrender.com";
async function showCompetition(userId, index) {
  const allUserDiv = document.querySelectorAll(".user");
  const userDiv = allUserDiv[index];
  let html = "";

  const user = await fetch(`${url}/users/${userId}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }).then((response) => response.json());

  // Check if user data exists
  if (!user) {
    html = `<p>User not found.</p>`;
    userDiv.insertAdjacentHTML("beforeend", html);
    return;
  }
  // Loop through rounds
  for (let i = 0; i < 3; i++) {
    const round = user.rounds[i] || [];
    html += `<div class="round">`;
    html += `<h3>Round ${i + 1}</h3>`;
    // Check if solves exist for the round
    if (round.solves && round.solves.length > 0) {
      html += `Ao5: ${getAverage(round.solves)}`;
      html += `<ul>`;
      for (let j = 0; j < round.solves.length; j++) {
        const time = round.solves[j] === 0 ? "DNF/DNS" : round.solves[j].toFixed(2); // if 0, display DNF/DNS
        html += `<li>Solve `;
        html += `${j + 1}: ${time}`;
        html += `</li><button type="button" onclick="deleteSolve('${userId}', ${i}, ${j})">Delete</button></li>`;
      }
      html += `</ul>`;
    } else {
      html += `<p>No solves for this round.</p>`;
    }

    // Add form to add solves (assuming you have elements with these IDs)
    if ((round.solves && round.solves.length < 5) || !round.solves) {
      html += `
      <form id="add-solve-${i}">
        <label for="solve-${i}">Solve:</label>`;
      html += `<input type="number" id="solve-${i}" name="solve">`;
      html += `<button type="button" onclick="addSolve('${userId}', ${i})">Add Solve</button>
      </form>
    `;
    }
    // Close .round div
    html += `</div>`;
  }

  userDiv.insertAdjacentHTML("beforeend", html);
}

async function addSolve(userId, roundIndex) {
  const solveInput = document.getElementById(`solve-${roundIndex}`);
  const solveValue = solveInput.value;

  // Check if solve value is a number
  if (isNaN(solveValue) || solveValue.trim() === "") {
    alert("Please enter a valid solve value (number).");
    return;
  }
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
    alert(data.message);
    // Update the competition display after successful addition
    main();
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
      location.href = "../Login/login.html";
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
    const data = await fetch(`${url}/assign-admin/${id}`, body);
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

async function main() {
  if (localStorage.getItem("role") === "user") {
    alert("Admins only!");
    location.href = "../home.html";
  }
  if (!localStorage.getItem("token")) {
    alert("Login again.");
    location.href = "../Login/login.html";
  }

  let users = await getUsers();
  displayUsers(users);
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
    html += `<p class="username">${username} (${id})</p>`;
    html += `<p class="role">Uloga: ${role}</p>`;
    html += `<p class="group">Grupa ${group}</p>`;
    // Add a delete button for each user
    html += `<button onclick="deleteUser('${id}')">Izbriši</button>`;
    html += `<button onclick="assignAdmin('${id}', '${username}')">Postavi za admina</button>`;
    html += `<button onclick="showCompetition('${id}', ${index})">Natjecanje</button>`;
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

async function deleteSolve(userId, roundIndex, solveIndex) {
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
    main();
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
  return average.toFixed(2);
}

getTime();
main();

// Call the function every 10 seconds to update the time automatically
setInterval(getTime, 1000 * 10);
