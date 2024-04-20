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
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    document.querySelector(".submit-btn").innerHTML = loadingHTML;
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
      document.querySelector(".submit-btn").innerHTML = "Prijava";
      if (response.ok) {
        // Save token to local storage or session storage
        localStorage.setItem("token", data.info.token);
        localStorage.setItem("id", data.info.id);
        localStorage.setItem("username", data.info.username);
        localStorage.setItem("role", data.info.role);
        // Redirect to a dashboard or another page
        if (data.info.role === "admin") {
          window.location.href = "../dashboard/";
        } else {
          window.location.href = "../";
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
