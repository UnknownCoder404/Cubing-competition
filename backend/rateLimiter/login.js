const rateLimit = require("express-rate-limit");
// Specific rate limit for the login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 login requests per windowMs
  message: "Too many login attempts, please try again after 15 minutes",
});
module.exports = loginLimiter;
