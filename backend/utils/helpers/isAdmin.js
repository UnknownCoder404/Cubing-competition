const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res
      .status(400)
      .json({ message: "Samo administratori imaju pristup." });
  }
  next();
};
module.exports = isAdmin;
