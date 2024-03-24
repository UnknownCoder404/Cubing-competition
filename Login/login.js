const url = "http://localhost:3000";
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      document.getElementById("message").innerText = data.message;
      if (response.ok) {
        // Save token to local storage or session storage
        localStorage.setItem("token", data.info.token);
        // Redirect to a dashboard or another page
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
