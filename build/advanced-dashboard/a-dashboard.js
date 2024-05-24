const url = "https://cubing-competition.onrender.com";
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
function logOut(refresh = false) {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  if (refresh) {
    window.location.reload();
  }
}
function loggedIn() {
  return Boolean(getToken()) && Boolean(getRole()) && Boolean(getId());
}
function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return token;
}
function getUsername() {
  const username = localStorage.getItem("username");
  if (!username) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return username;
}
function getRole() {
  const role = localStorage.getItem("role");
  if (!role) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return role;
}
function getId() {
  const id = localStorage.getItem("id");
  if (!id) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return id;
}
String.prototype.addToken = function (token = getToken()) {
  return `${this}${this.includes("?") ? "&" : "?"}token=${token}`;
};

Object.prototype.addToken = function (token = getToken()) {
  let object = this;
  object.Authorization = token;
  return object;
};
String.prototype.isUser = function () {
  return this.toUpperCase() === "USER";
};
String.prototype.isAdmin = function () {
  return this.toUpperCase() === "ADMIN";
};
function downloadFile(url, fileName) {
  if (!url || !fileName) return -1;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  return 1;
}
const getPasswordsBtn = document.querySelector(".passwords");
const getResultsBtn = document.querySelector(".results");
getResultsBtn.addEventListener("click", getResults);
getPasswordsBtn.addEventListener("click", getPasswords);
function getResults() {
  getResultsBtn.disabled = true;
  const resultsUrl = `${url}/results`.addToken();
  downloadFile(resultsUrl, "results"); // You can specify the desired file name
  getResultsBtn.disabled = false;
}

function getPasswords() {
  getResultsBtn.disabled = true;
  const passwordsUrl = `${url}/passwords`.addToken();
  downloadFile(passwordsUrl, "passwords"); // You can specify the desired file name
  getResultsBtn.disabled = false;
}
async function changePassword(username, newPassword) {
  const body = {
    username,
    newPassword,
  };
  const request = {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }.addToken(),
  };
  const data = await fetch(`${url}/users/change-password`, request);
  const response = await data.json();
  console.log(response.message);
  console.log(data.status);
  return response;
}
const changePasswordSubmitBtn = document.querySelector(
  ".change-password-submit-btn"
);
const newPasswordInput = document.querySelector(".new-password");
const usernameInput = document.querySelector(".username");
changePasswordSubmitBtn.addEventListener("click", async () => {
  changePasswordSubmitBtn.disabled = true;
  const prevHtml = changePasswordSubmitBtn.innerHTML;
  changePasswordSubmitBtn.innerHTML = loadingHTML;
  const username = usernameInput.value;
  const password = newPasswordInput.value;
  const changePasswordOutput = await changePassword(username, password);
  changePasswordSubmitBtn.innerHTML = prevHtml;
  changePasswordSubmitBtn.disabled = false;
  document.querySelector(".message").innerHTML = changePasswordOutput.message;
  alert(changePasswordOutput.message);
});
async function tokenValid(action = false) {
  // action, if true it will logout user if token is not valid
  console.log("Provjera vrijednosti tokena...");
  const tokenValidUrl = `${url}/token`.addToken();
  const data = await fetch(tokenValidUrl);
  console.log(data.ok ? "Token is valid." : "Token is invalid.");
  if (action && !data.ok) {
    console.log("Odjavljivanje...");
    //logOut();
    alert("Prijavi se ponovno");
    //window.location.href = "../Login";
  }
  return data.ok;
}
tokenValid(true);
