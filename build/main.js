import { url } from "./Scripts/variables.js";
import {
  tokenValid,
  isAdmin,
  getUsername,
  getRole,
  logOut,
  loggedIn,
  addToken,
} from "./Scripts/credentials.js";
const cardsDiv = document.querySelector(".cards");
async function getPosts() {
  // Returns json of posts
  const data = await fetch(`${url}/posts`);
  const posts = await data.json();
  return posts;
}
function addDashboardCard() {
  let html = "";
  html += `
  <div class="card">
   <div class="container">
      <h2>Radna ploča</h2>
      <p>Ti si admin. Oni imaju pristup <a href="./dashboard">radnoj ploči!</a></p>
</div>
</div>
  `;
  cardsDiv.insertAdjacentHTML("beforeEnd", html);
}
function addCreatePostCard() {
  const html = `
  <div class="card">
  <div class="container">
    <h2>Objava</h2>
    <p>
      Ti si admin! Oni mogu objaviti bilo što!
      Klikni <a href="./posts">ovdje</a> da objaviš nešto.
    </p>
  </div>
</div>
  `;
  cardsDiv.insertAdjacentHTML("beforeend", html);
}
function generateLogOutCard(username = getUsername()) {
  if (!username) return;
  let html = "";
  html += `
  <div class="card">
  <div class="container">
      <h2>Odjavi se</h2>
      <p>Ako se želiš odjaviti iz korisničkog računa "${username}" klikni <span class="logout-span">ovdje</span>.</p>
      </div> <!-- container class -->
      </div> <!-- card class -->
      `;
  return html;
}

document.querySelector(".share").addEventListener("click", async () => {
  if (navigator.share) {
    await navigator.share({
      title: "Dođi na natjecanje!",
      text: `Zagreb međuškolsko 2024 (neslužbeno) u slaganje Rubikove kocke

      Bit će 3.5. u dvorani Oš. Pavleka Miškine
      14-16:30
      
      Smiju se natjecati samo OSNOVNOŠKOLCI.
      
      Natjecateljsko ograničenje je 50, ako ga se pređe bit ćete stavljeni na listu čekanja.
      
      Želite li se prijaviti (ime, prezime, škola, razred ) ili imate pitanja pošaljite na cro.cube.club@gmail.com
      `,
      url: "https://cutt.ly/CroComp",
    });
    console.log("Successfully shared");
  } else {
    alert(
      "Ovaj uređaj ne može dijeliti. Preporučuje se najnovija verzija Google Chrome-a."
    );
  }
});
function createPostHtml(post) {
  const { title, description } = post;
  const authorUsername = post.author.username;
  const html = `
<div class="card">
  <div class="card-inside-container">
    <div class="post-title-container">
      <h2 class="post-title">${title}</h2>
    </div>
    <div class="post-description-container">
      <p class="post-description">
        ${description}
      </p>
    </div>
    <div class="post-author-container">
      <p class="post-author-p">Objavio <span class="post-author">${authorUsername}</span>
      </p>
    </div>
  </div>
</div>`;
  return html;
}
async function checkIfLoggedInAndTokenValid() {
  if (loggedIn() && !(await tokenValid())) {
    logOut();
    window.location.href = "./Login";
  }
}
async function main() {
  checkIfLoggedInAndTokenValid();
  const posts = await getPosts();
  posts.forEach((post) => {
    const html = createPostHtml(post);
    cardsDiv.insertAdjacentHTML("beforeend", html);
  });
}
const logInElement = document.querySelector(".js-log-in");
const username = getUsername();
const role = getRole();
if (role && isAdmin(role)) {
  addDashboardCard();
  addCreatePostCard();
}
if (username) {
  logInElement.innerHTML = username;
}
if (username) {
  const html = generateLogOutCard(username);

  cardsDiv.insertAdjacentHTML("beforeEnd", html);
  const logOutSpan = document.querySelector(".logout-span");
  logOutSpan.addEventListener("click", async () => {
    logOut(true);
  });
}
const accountCircle = document.querySelector(".account-circle");

if (username) {
  accountCircle.addEventListener("click", async () => {
    logOut(true);
  });
  const root = document.querySelector(":root");
  root.style.setProperty("--logged-in", "pointer");
}
main();
