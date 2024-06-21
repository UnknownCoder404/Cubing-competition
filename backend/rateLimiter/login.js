const rateLimit = require("express-rate-limit");
// Specific rate limit for the login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 login requests per windowMs
  message: "Previše pokušaja prijave, pokušajte ponovno za 15 minuta.",
});
module.exports = loginLimiter;
