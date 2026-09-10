const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Dummy storage for verified mobile numbers (replace with a database)
const verifiedMobileNumbers = new Set();

app.post("/send-verification-code", (req, res) => {
  const { mobileNumber } = req.body;

  // Implement logic to send a verification code to the provided mobile number
  // You may use a service like Twilio for SMS-based verification

  // For simplicity, assume verification code is sent successfully
  res.status(200).send({ success: true });
});

app.post("/verify-mobile-number", (req, res) => {
  const { mobileNumber, verificationCode } = req.body;

  // Implement logic to verify the entered code against the code sent to the user's mobile number
  // For simplicity, assume verification is successful
  verifiedMobileNumbers.add(mobileNumber);

  res.status(200).send({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
