import express from "express";
import { config } from "dotenv";
import fs from "fs";
import cors from "cors";
import { sendEmail, verifySMTP } from "./utils/sendEmail.js";

// Initialize - prefer `config.env` but fall back to `.env` if present
const envPath = fs.existsSync("./config.env") ? "./config.env" : fs.existsSync("./.env") ? "./.env" : undefined;
if (envPath) {
  config({ path: envPath });
  console.log(`Loaded env from ${envPath}`);
} else {
  // fallback to default dotenv behavior (no path)
  config();
  console.log("Loaded env using default dotenv config()");
}
const app = express();
const router = express.Router();

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(
  cors({
    // Prefer explicit FRONTEND_URL in production; fall back to allowing all
    origin: process.env.FRONTEND_URL || true,
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

// Log the CORS configuration for debugging (do not expose secrets in logs)
console.log("CORS origin set to:", process.env.FRONTEND_URL || "<allow all>");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Route 1: Contact Form Email
router.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body;

  // Log incoming body for debugging (avoid logging in production with secrets)
  console.log("[/send/mail] body:", req.body);

  const missing = [];
  if (!name) missing.push("name");
  if (!email) missing.push("email");
  if (!message) missing.push("message");

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Please provide all details. Missing: ${missing.join(", ")}`,
    });
  }

  try {
    await sendEmail({
      email: "noorsetia24@navgurukul.org",
      subject: "GYM WEBSITE CONTACT",
      message,
      userEmail: email,
    });

    res.status(200).json({ success: true, message: "Message Sent Successfully." });
  } catch (error) {
    console.error("[/send/mail] error:", error && error.message ? error.message : error);
    // Return a clearer error message to help debugging (avoid exposing secrets in production)
    res.status(500).json({
      success: false,
      message: error && error.message ? error.message : "Internal Server Error",
    });
  }
});

// Utility route to verify SMTP configuration (useful for deployment checks)
router.get("/mail/verify", async (req, res) => {
  try {
    await verifySMTP();
    res.json({ success: true, message: "SMTP verified" });
  } catch (err) {
    console.error("[/mail/verify] error:", err && err.message ? err.message : err);
    res.status(500).json({ success: false, message: err && err.message ? err.message : "SMTP verification failed" });
  }
});

// ✅ Route 2: BMI Calculator
router.post("/calculate-bmi", (req, res) => {
  const { height, weight, gender } = req.body;

  if (!height || !weight || !gender) {
    return res.status(400).json({ error: "Invalid input data." });
  }

  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi >= 18.5 && bmi < 24.9) category = "Normal";
  else if (bmi >= 25 && bmi < 29.9) category = "Overweight";
  else category = "Obese";

  res.json({ bmi, category });
});

// Mount Router
app.use(router);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
