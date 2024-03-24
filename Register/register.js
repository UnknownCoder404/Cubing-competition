const url = "http://localhost:3000";

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) {
      alert("Only admins can register users.");
      window.location.href = "../Login/login.html";
    }
    try {
      const response = await fetch(`${url}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: TOKEN,
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      alert(data.message);
      document.getElementById("message").innerText = data.message;
    } catch (error) {
      console.error("Error:", error);
    }
  });
