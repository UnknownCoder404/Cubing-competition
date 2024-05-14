const url = "https://cubing-competition.onrender.com";
const submitBtn = document.querySelector(".submit-btn");
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
Element.prototype.toggleDisabled = function () {
  this.disabled = !this.disabled;
};
String.prototype.isAdmin = function () {
  return this.toUpperCase() === "ADMIN";
};
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (credentialsCheck(username, password)) {
      return;
    }
    submitBtn.innerHTML = loadingHTML;
    submitBtn.toggleDisabled();

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
        const { token, id, username, role } = data.info;
        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        // Redirect to a dashboard or another page
        if (data.info.role.isAdmin()) {
          // Dashboard
          window.location.href = "../dashboard/";
        } else {
          // Home page
          window.location.href = "../";
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
    submitBtn.innerHTML = "Prijava";
    submitBtn.disabled = false;
  });
function credentialsCheck(username, password) {
  if (!username || !password) {
    alert("Korisničko ime i lozinka su obavezni.");
    return true;
  }
  return false;
}
