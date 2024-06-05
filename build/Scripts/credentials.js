import { url } from "./variables.js";
function getUsername(action = false) {
  const username = localStorage.getItem("username");
  if (action && !username) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return username;
}
function getRole(action = false) {
  const role = localStorage.getItem("role");
  if (action && !role) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return role;
}
function getId(action = false) {
  const id = localStorage.getItem("id");
  if (action && !id) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return id;
}
function getToken(action = false) {
  const token = localStorage.getItem("token");
  if (action && !token) {
    logOut();
    alert("Prijavi se ponovno.");
    location.href = "../Login/";
    return null;
  }
  return token;
}
function logOut(refresh = false) {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  if (refresh) {
    window.location.reload();
  }
}
async function tokenValid(action = false) {
  // action, if true it will logout user if token is not valid
  console.log("Checking token validity...");
  const tokenValidUrl = addToken(`${url}/token`);
  const data = await fetch(tokenValidUrl);
  console.log(data.ok ? "Token is valid." : "Token is invalid.");
  if (action && !data.ok) {
    console.log("Odjavljivanje...");
    logOut();
    alert("Prijavi se ponovno");
    window.location.href = "../Login";
  }
  return data.ok;
}
function loggedIn() {
  return Boolean(getToken()) && Boolean(getRole()) && Boolean(getId());
}
function isUser(role) {
  return role.toUpperCase() === "USER";
}
function isAdmin(role) {
  return role.toUpperCase() === "ADMIN";
}
function addToken(data = undefined, token = getToken()) {
  if (typeof data === "string") {
    return `${data}${data.includes("?") ? "&" : "?"}token=${token}`;
  }
  if (typeof data === "object") {
    data.Authorization = token;
    return data;
  }
  if (!data) {
    return getToken();
  }
  return null;
}
export {
  getUsername,
  getRole,
  getId,
  getToken,
  logOut,
  tokenValid,
  loggedIn,
  isUser,
  isAdmin,
  addToken,
};
