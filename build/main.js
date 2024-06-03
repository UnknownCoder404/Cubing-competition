import { url } from "./Scripts/variables.js";
import {
  tokenValid,
  getToken,
  getUsername,
  getRole,
  logOut,
} from "./Scripts/credentials.js";
const cardsDiv = document.querySelector(".cards");
String.prototype.isUser = function () {
  return this.toUpperCase() === "USER";
};
String.prototype.isAdmin = function () {
  return this.toUpperCase() === "ADMIN";
};
String.prototype.addToken = function (token = getToken()) {
  return `${this}${this.includes("?") ? "&" : "?"}token=${token}`;
};
Object.prototype.addToken = function (token = getToken()) {
  let object = this;
  object.Authorization = token;
  return object;
};
function createNewPostDialog() {
  const dialog = document.createElement("dialog");
  dialog.innerHTML = `
    <form id="postForm">
      <label for="title">Title:</label><br>
      <input type="text" id="title" name="title" required><br>
      <label for="description">Description:</label><br>
      <textarea id="description" name="description" required></textarea><br><br>
      <button type="submit">Submit</button>
    </form>
  `;

  dialog.addEventListener("close", () => {
    dialog.remove();
  });

  document.body.appendChild(dialog);
  dialog.showModal();

  const postForm = document.getElementById("postForm");
  postForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titleElement = document.getElementById("title");
    const descriptionElement = document.getElementById("description");

    const title = titleElement.value;
    const description = descriptionElement.value;

    try {
      const response = await fetch(`${url}/posts/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }.addToken(),
        body: JSON.stringify({ title, description }),
      });
      const data = await response.json();
      if (response.ok) {
        const newPost = data;
        console.log("New post created:", newPost);
        dialog.close();
      } else {
        const errorData = data;
        console.error("Error creating post:", errorData.message);
        alert("Error creating post: " + errorData.message);
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again later.");
    }
  });
}
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
      Klikni <span onclick="createNewPostDialog()" class="post">ovdje</span> da objaviš nešto.
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
      url: "https://bit.ly/CroComp",
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
  const html = `<div class="card">
  <div class="container">
    <h2 class="post-title">${title}</h2>
    <p class="post-description">
      ${description}
    </p>
    Objavio <span class="post-author">${authorUsername}</span>
  </div>
</div>`;
  return html;
}
async function main() {
  if (!tokenValid()) {
    logOut(true);
  }
  const posts = await getPosts();
  posts.forEach((post) => {
    const html = createPostHtml(post);
    cardsDiv.insertAdjacentHTML("beforeend", html);
  });
}
const logInElement = document.querySelector(".js-log-in");
const username = getUsername();
const role = getRole();
if (role && role.isAdmin()) {
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
