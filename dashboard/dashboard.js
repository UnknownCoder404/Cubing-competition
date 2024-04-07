const usersDiv = document.querySelector(".users");

async function getUsers() {
  const body = {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try {
    const data = await fetch("http://localhost:3000/users/all", body);
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
  try {
    const body = {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    const data = await fetch(`http://localhost:3000/users/${id}`, body);
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
    const data = await fetch(`http://localhost:3000/assign-admin/${id}`, body);
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

  let html = "";
  let users = await getUsers();
  usersDiv.innerHTML = "";
  users.forEach((user, index) => {
    const username = user.username;
    const id = user.id;
    const role = user.role;
    html += `<div class="user">`;
    html += `<p class="username">${username} (${id})</p>`;
    html += `<p class="role">${role}</p>`;
    // Add a delete button for each user
    html += `<button onclick="deleteUser('${id}')">Delete</button>`;
    html += `<button onclick="assignAdmin('${id}', '${username}')">Assign admin</button>`;
    html += `</div>`; // end user div
  });
  usersDiv.innerHTML = html;
}

main();
