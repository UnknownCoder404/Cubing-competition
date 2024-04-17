const logInEle = document.querySelector(".js-log-in");
const username = localStorage.getItem("username");
const cardsDiv = document.querySelector(".cards");
if (username) {
  logInEle.innerHTML = username;
}
const role = localStorage.getItem("role");

if (role === "admin") {
  let html = "";
  html += `
  <div class="card">
      <h2>Radna ploča</h2>
      <p>Ti si admin. Oni imaju pristup <a href="./dashboard/dashboard.html">radnoj ploči!</a></p>
  `;
  cardsDiv.insertAdjacentHTML("beforeEnd", html);
}
