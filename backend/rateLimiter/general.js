const rateLimit = require("express-rate-limit");
// Define the rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 250, // limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  headers: true, // Send X-RateLimit-* headers with limit and remaining
});

module.exports = generalLimiter;
