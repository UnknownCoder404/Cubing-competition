import { url, loadingHTML } from "../Scripts/variables.js";
import { isAdmin, loggedIn } from "../Scripts/credentials.js";
const submitBtn = document.querySelector(".submit-btn");
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const messageElement = document.querySelector(".message");
  const username = document.querySelector(".username-input").value;
  const password = document.querySelector(".password-input").value;
  messageElement.innerHTML = "";

  if (credentialsCheck(username, password)) return;

  const submitBtn = document.querySelector(".submit-button");
  submitBtn.innerHTML = loadingHTML;
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${url}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    const message = data.message;

    if (response.status === 429) {
      displayError(
        messageElement,
        "Previše zahtjeva za prijavu. Pokušaj ponovno za 15 minuta."
      );
      return;
    }

    if (response.ok) {
      messageElement.innerText = message;
      saveUserInfo(data.info);
      window.location.href = isAdmin(data.info.role) ? "../dashboard/" : "../";
    } else {
      displayError(messageElement, message);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    resetSubmitButton(submitBtn);
  }
});

function displayError(element, message) {
  element.innerHTML = `<span class="error">${message}</span>`;
  console.error(message);
}

function saveUserInfo({ token, id, username, role }) {
  localStorage.setItem("token", token);
  localStorage.setItem("id", id);
  localStorage.setItem("username", username);
  localStorage.setItem("role", role);
}

function resetSubmitButton(button) {
  button.disabled = false;
  button.innerHTML = "Prijava";
}

function credentialsCheck(username, password) {
  if (!username || !password) {
    alert("Korisničko ime i lozinka su obavezni.");
    return true;
  }
  return false;
}
if (loggedIn()) {
  window.location.href = "../";
}
