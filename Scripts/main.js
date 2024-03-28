const logInEle = document.querySelector(".js-log-in");
const username = localStorage.getItem("username");
if (username) {
  logInEle.innerHTML = username;
}
