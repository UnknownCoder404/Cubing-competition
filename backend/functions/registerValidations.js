function checkUsernameAndPassword(username, password, res) {
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Korisničko ime i lozinka su obavezni." });
  }
}

function checkUsernameLength(username, res) {
  if (username.length < 5) {
    return res
      .status(400)
      .json({ message: "Korisničko ime mora biti duže od 4 znaka." });
  }
}

function checkPasswordLength(password, res) {
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Lozinka mora biti duža od 7 znakova." });
  }
}

function checkUsernameAndPasswordEquality(username, password, res) {
  if (username === password) {
    return res
      .status(400)
      .json({ message: "Korisničko ime i lozinka ne mogu biti isti." });
  }
}

function checkGroup(group, res) {
  if (group !== 1 && group !== 2) {
    return res.status(400).json({ message: "Grupa mora biti 1 ili 2." });
  }
}

function checkPasswordSpaces(password, res) {
  if (password.split("").includes(" ")) {
    return res
      .status(400)
      .json({ message: "Lozinka ne smije koristiti razmak." });
  }
}
module.exports = {
  checkUsernameAndPassword,
  checkUsernameLength,
  checkPasswordLength,
  checkUsernameAndPasswordEquality,
  checkGroup,
  checkPasswordSpaces,
};
