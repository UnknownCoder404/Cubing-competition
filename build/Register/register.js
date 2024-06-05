import { url, loadingHTML } from "../Scripts/variables.js";
import { getToken, addToken } from "../Scripts/credentials.js";
const group1Checkbox = document.querySelector(".group-1");
const submitBtn = document.querySelector(".submit-btn");
const messageElement = document.getElementById("message");
const usernameElement = document.getElementById("username");
const passwordElement = document.getElementById("password");
function clearInput(input) {
  input.value = "";
}

function maskMiddle(str) {
  if (str.length <= 2) {
    return str;
  }

  const length = str.length;
  const firstPartLength = Math.ceil(length * 0.2);
  const lastPartLength = Math.floor(length * 0.2);
  const middlePartLength = length - firstPartLength - lastPartLength;

  const firstPart = str.substring(0, firstPartLength);
  const lastPart = str.substring(length - lastPartLength);

  return firstPart + "*".repeat(middlePartLength) + lastPart;
}

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = usernameElement.value;
    const password = passwordElement.value;
    const group = isChecked(group1Checkbox) ? 1 : 2;
    if (credentialsCheck(username, password, group)) {
      return;
    }
    // Disable the button to prevent multiple clicks
    submitBtn.disabled = true;

    submitBtn.innerHTML = loadingHTML;

    getToken(); // Make sure that token exists, if not bring to login page
    try {
      const response = await fetch(`${url}/register`, {
        method: "POST",
        headers: addToken({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ username, password, group }),
      });
      submitBtn.disabled = false; // Re-enable the button
      submitBtn.innerHTML = "Registriraj";
      const data = await response.json();
      alert(data.message);
      messageElement.innerText = `${data.message}
Username: ${data.registeredUser.username}
Password: ${maskMiddle(data.registeredUser.password)}`;
      clearInput(usernameElement);
      clearInput(passwordElement);
    } catch (error) {
      console.error("Error:\n", error);
    }
    submitBtn.disabled = false; // Re-enable the button
    submitBtn.innerHTML = "Registriraj";
  });

function isChecked(checkbox) {
  return checkbox.checked;
}
function credentialsCheck(username, password, group) {
  if (!username || !password) {
    alert("Korisničko ime i lozinka su obavezni.");
    return true;
  }
  if (username.length <= 4) {
    alert("Korisničko ime mora biti duže od 4 znaka.");
    return true;
  }
  if (password.length <= 7) {
    alert("Lozinka mora biti duža od 7 znakova.");
    return true;
  }
  if (username === password) {
    alert("Korisničko ime i lozinka ne mogu biti isti.");
    return true;
  }
  if (group !== 1 && group !== 2) {
    alert("Grupa mora biti 1 ili 2.");
    return true;
  }
  return false;
}
