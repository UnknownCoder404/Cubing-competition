import { url, loadingHTML } from "../Scripts/variables.js";
import { isAdmin } from "../Scripts/credentials.js";
const submitBtn = document.querySelector(".submit-btn");
Element.prototype.disable = function () {
  this.disabled = true;
};
Element.prototype.enable = function () {
  this.disabled = false;
};
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const messageElement = document.querySelector(".message");
  const usernameInput = document.querySelector(".username-input");
  const passwordInput = document.querySelector(".password-input");
  const username = usernameInput.value;
  const password = passwordInput.value;
  messageElement.innerHTML = "";
  if (credentialsCheck(username, password)) {
    return;
  }
  submitBtn.innerHTML = loadingHTML;
  submitBtn.disable();

  try {
    const response = await fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.status === 429) {
      messageElement.innerHTML =
        '<span class="error">' +
        "Previše zahtjeva za prijavu. Pokušaj ponovno za 15 minuta." +
        "</span>";
      console.error(
        "Previše zahtjeva za prijavu. Pokušaj ponovno za 15 minuta."
      );
      submitBtn.enable();
      return;
    }
    const data = await response.json();

    const message = data.message;
    if (response.ok) {
      messageElement.innerText = message;
    } else {
      messageElement.innerHTML = `<span class="error">${message}</span>`;
    }
    if (response.ok) {
      // Save token to local storage or session storage
      const { token, id, username, role } = data.info;
      localStorage.setItem("token", token);
      localStorage.setItem("id", id);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      // Redirect to a dashboard or another page
      window.location.href = isAdmin(role) ? "../dashboard/" : "../";
    }
  } catch (error) {
    console.error("Error:", error);
  }
  submitBtn.innerHTML = "Prijava";
  submitBtn.enable();
});
function credentialsCheck(username, password) {
  if (!username || !password) {
    alert("Korisničko ime i lozinka su obavezni.");
    return true;
  }
  return false;
}
