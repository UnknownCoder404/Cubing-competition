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
      <p>Ti si admin. Oni imaju pristup <a href="./dashboard">radnoj ploči!</a></p></div>
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
  <div class="container">
      <h2>Odjavi se</h2>
      <p>Ako se želiš odjaviti iz korisničkog računa "${username}" klikni <span class="logout-span">ovdje</span>.</p></div></div>`;
  cardsDiv.insertAdjacentHTML("beforeEnd", html);
  let logOutSpan = document.querySelector(".logout-span");
  logOutSpan.addEventListener("click", async () => {
    await logOut();
  });
}
document.querySelector(".share").addEventListener("click", async () => {
  if (navigator.share) {
    await navigator.share({
      title: "Dođi na natjecanje!",
      text: `Zagreb međuškolsko 2024 (neslužbeno) u slaganje Rubikove kocke

      Bit će 3.5. u dvorani Oš. Pavleka Miškine
      14-16:30
      
      Smiju se natjecati samo OSNOVNOŠKOLCI.
      
      Natjecateljsko ograničenje je 50, ako ga se pređe bit će te stavljeni na listu čekanja.
      
      Želite li se prijaviti (ime, prezime, škola, razred ) ili imate pitanja pošaljite na cro.cube.club@gmail.com`,
      url: "https://bit.ly/CroComp",
      files: ["../Images/qrcode_to_website.png"],
    });
    console.log("Successfully shared");
  } else {
    alert("Ovaj uređaj ne može dijeliti.");
  }
});
