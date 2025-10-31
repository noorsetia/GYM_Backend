import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail.js";

// Initialize
config({ path: "./config.env" });
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
    // reflect request origin to avoid CORS issues during development
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Route 1: Contact Form Email
router.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide all details",
    });
  }

  try {
    await sendEmail({
      email: "noorsetia24@navgurukul.org",
      subject: "GYM WEBSITE CONTACT",
      message,
      userEmail: email,
    });

    res.status(200).json({
      success: true,
      message: "Message Sent Successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
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
