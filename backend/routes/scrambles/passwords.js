const express = require("express");
const verifyToken = require("../../middleware/verifyToken");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();
router.get("/passwords", verifyToken, (req, res) => {
  if (req.userRole !== "admin") {
    res.status(401).send("<p>Samo administratori imaju pristup lozinkama.</p>");
    return;
  }
  const currentDateTime = getCurrentDateTimeInZagreb();
  if (
    currentDateTime.year >= 2024 &&
    currentDateTime.month >= 5 &&
    currentDateTime.day >= 3 &&
    currentDateTime.hour >= 14
  ) {
    const htmlResponse = `
      <html>
        <head><title>Passwords</title>
        <style>/* Osnovni stil za desktop */
        p {
          font-size: 16px;
        }
        
        /* Stil za uređaje s maksimalnom širinom od 600px */
        @media (max-width: 600px) {
          p {
            font-size: 18px; /* Povećana veličina teksta za bolju čitljivost na telefonima */
          }
        }</style>
        </head>
        <body>
          <p style="font-size: 15px">Lozinka 1. grupe: ${process.env.G1PASSWORD}</p>
          <p>Lozinka 2. grupe: ${process.env.G2PASSWORD}</p>
          <p>NE DIJELI OVAJ LINK!!!!</p>
        </body>
      </html>`;
    res.status(200).send(htmlResponse);
    return;
  }
  res.status(401).send(`<p>Pristupno tek 03.05.2024 u 14:00</p>
   <p>NE DIJELI OVAJ LINK!!!!</p>`);
});
module.exports = router;
