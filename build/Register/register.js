const url = "https://cubing-competition.onrender.com";
const group1Checkbox = document.querySelector(".group-1");
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
function validateString(input) {
  // Regular expression to match alphabet letters, numbers, and exclamation marks
  const regex = /^[a-zA-Z0-9!]+$/;
  return regex.test(input);
}
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
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const group = isChecked(group1Checkbox) ? 1 : 2;
    const TOKEN = localStorage.getItem("token");
    if (!TOKEN) {
      alert("Only admins can register users.");
      window.location.href = "../Login/login.html";
    }
    if (!validateString(username) || !validateString(password)) {
      alert("Samo slova,brojevi i uskličnik dozvoljeni");
      return;
    }
    document.querySelector(".submit-btn").innerHTML = loadingHTML;
    try {
      const response = await fetch(`${url}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: TOKEN,
        },
        body: JSON.stringify({ username, password, group }),
      });
      document.querySelector(".submit-btn").innerHTML = "Registriraj";
      const data = await response.json();
      alert(data.message);
      document.getElementById("message").innerText = `${data.message}
Username: ${data.registeredUser.username}
Password: ${maskMiddle(data.registeredUser.password)}`;
      clearInput(document.getElementById("username"));
      clearInput(document.getElementById("password"));
    } catch (error) {
      console.error("Error:", error);
      document.querySelector(".submit-btn").innerHTML = "Registriraj";
    }
  });

function isChecked(checkbox) {
  return checkbox.checked;
}
