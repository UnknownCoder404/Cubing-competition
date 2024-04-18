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
      <p>Ti si admin. Oni imaju pristup <a href="./dashboard">radnoj ploči!</a></p>
  `;
  cardsDiv.insertAdjacentHTML("beforeEnd", html);
}
async function logOut() {
  localStorage.removeItem("id");
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  location.reload();
}
if (username) {
  let html = "";
  html += `
  <div class="card">
      <h2>Odjavi se</h2>
      <p>Ako se želiš odjaviti iz korisničkog računa "${username}" klikni <span class="logout-span">ovdje</span>.</p>
  `;
  cardsDiv.insertAdjacentHTML("beforeEnd", html);
  let logOutSpan = document.querySelector(".logout-span");
  logOutSpan.addEventListener("click", async () => {
    await logOut();
  });
}
