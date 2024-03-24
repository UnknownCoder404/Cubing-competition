const url = "http://localhost:3000";
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
      document.getElementById("message").innerText = `${
        data.message
      }\nUsername: ${data.registeredUser.username}\nPassword: ${maskMiddle(
        data.registeredUser.password
      )}`;
    } catch (error) {
      console.error("Error:", error);
    }
  });
