const rateLimit = require("express-rate-limit");
// Specific rate limit for the login route
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: "Too many register attempts, please try again after 15 minutes",
});
module.exports = registerLimiter;
